'use client';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface ExcelExportOptions {
    filename?: string;
    sheetName?: string;
    title?: string;
    titleCell?: string;
    titleMergeTo?: string;
}

export const exportToExcel = async <T extends Record<string, any>>(
    data: T[],
    columns: { key: keyof T; header: string; width?: number }[],
    options: ExcelExportOptions = {}
) => {
    const {
        filename = 'export.xlsx',
        sheetName = 'Sheet1',
        title,
        titleCell = 'B2',
        titleMergeTo = 'J2',
    } = options;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // 제목 추가 (B2)
    if (title) {
        worksheet.getCell(titleCell).value = title;
        worksheet.mergeCells(titleCell, titleMergeTo);
        worksheet.getCell(titleCell).font = { size: 14, bold: true };
        worksheet.getCell(titleCell).alignment = {
            vertical: 'middle',
            horizontal: 'left'
        };
        worksheet.getRow(2).height = 22;
    }

    // 표 시작 위치 (B5)
    const startRow = 5;
    const startCol = 2; // B열

    // 헤더 추가
    columns.forEach((col, index) => {
        const cell = worksheet.getCell(startRow, startCol + index);
        cell.value = col.header;
    });

    // 데이터 추가
    data.forEach((row, rowIndex) => {
        columns.forEach((col, colIndex) => {
            const cell = worksheet.getCell(startRow + 1 + rowIndex, startCol + colIndex);
            cell.value = row[col.key] ?? '';
        });
    });

    // 컬럼 폭 설정
    columns.forEach((col, index) => {
        worksheet.getColumn(startCol + index).width = col.width ?? 15;
    });

    // 스타일 적용
    const headerRow = worksheet.getRow(startRow);
    headerRow.height = 20;

    const thinBorder: Partial<ExcelJS.Borders> = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };

    // 테이블 범위 계산
    const lastRow = startRow + data.length;
    const lastCol = startCol + columns.length - 1;

    // 테이블 전체에 스타일 적용
    for (let r = startRow; r <= lastRow; r++) {
        for (let c = startCol; c <= lastCol; c++) {
            const cell = worksheet.getCell(r, c);

            // 테두리 및 정렬
            cell.border = thinBorder;
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            };

            // 헤더 스타일
            if (r === startRow) {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFEFEFEF' }, // 연회색
                };
            }
        }
    }

    // 파일 저장
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, filename);
};
