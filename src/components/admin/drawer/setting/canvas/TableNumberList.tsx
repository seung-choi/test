'use client';

import React, { useMemo, useState, useEffect } from 'react';
import styles from '@/styles/components/admin/drawer/canvas/tableNumberList.module.scss';
import { useDeleteTable, usePostTable, useTableErpList, useTableList } from '@/hooks/api';
import { useQueryClient } from '@tanstack/react-query';
import storage from '@/utils/storage';
import type { TableNumberListProps } from '@/types';

const TableNumberList: React.FC<TableNumberListProps> = ({ linkedNumbers = [] }) => {
    const queryClient = useQueryClient();
    const { data: tableList = [] } = useTableList();
    const { refetch: refetchErpList, isFetching } = useTableErpList({ enabled: false });
    const { mutateAsync: postTable, isPending: isPosting } = usePostTable();
    const { mutateAsync: deleteTable, isPending: isDeleting } = useDeleteTable();
    const [isAdding, setIsAdding] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const [isErpConnected, setIsErpConnected] = useState(false);

    useEffect(() => {
        const flag = storage.session.get('iserpconnected');
        setIsErpConnected(String(flag) === 'true');
    }, []);

    const tableNumbers = useMemo(
        () =>
            [...tableList]
                .sort((a, b) => a.tableOrd - b.tableOrd)
                .map((table) => table.tableNo),
        [tableList]
    );

    const normalizeNumber = (value: string) => value.trim().replace(/번$/, '');
    const allNumbers = useMemo(
        () => tableNumbers.filter((number) => normalizeNumber(number)),
        [tableNumbers]
    );

    const linkedSet = useMemo(() => {
        return new Set(linkedNumbers.map(normalizeNumber));
    }, [linkedNumbers]);

    const handleErpSync = async () => {
        const result = await refetchErpList();
        if (result.data) {
            queryClient.setQueryData(['tableList'], result.data);
        }
    };

    const handleAddClick = () => {
        setIsAdding(true);
        setManualInput('');
    };

    const handleSaveManual = async () => {
        const normalized = normalizeNumber(manualInput);
        if (!normalized) return;

        const existing = allNumbers.map(normalizeNumber);
        if (existing.includes(normalized)) return;

        const erpResult = await refetchErpList();
        const erpList = erpResult.data ?? [];
        const maxOrd = erpList.reduce((max, table) => Math.max(max, table.tableOrd || 0), 0);
        const nextOrd = maxOrd > 0 ? maxOrd + 1 : 1;

        await postTable({ tableNo: normalized, tableOrd: nextOrd });
        setIsAdding(false);
        setManualInput('');
    };

    const handleDeleteTable = async (tableNo: string) => {
        const normalized = normalizeNumber(tableNo);
        const targetTable = tableList.find((table) => normalizeNumber(table.tableNo) === normalized);
        if (!targetTable) return;

        if (window.confirm(`${tableNo} 테이블을 삭제하시겠습니까?`)) {
            await deleteTable(targetTable.tableId);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>테이블 번호</h2>
                {isErpConnected && (
                    <button
                        className={styles.erpButton}
                        onClick={handleErpSync}
                        disabled={isFetching}
                    >
                        ERP 연동
                    </button>
                )}
            </div>
            <div className={styles.listContainer}>
                <div className={styles.list}>
                    {allNumbers.length === 0 && !isAdding && (
                        <div className={styles.emptyState}>테이블이 없습니다</div>
                    )}
                    {allNumbers.map((number, index) => {
                        const isLinked = linkedSet.has(normalizeNumber(number));
                        const displayNumber = number.endsWith('번') ? number : `${number}번`;
                        return (
                            <div key={index} className={`${styles.listItem} ${isLinked ? styles.listItemLinked : ''}`}>
                                {displayNumber}
                                {!isErpConnected && (
                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteTable(number)}
                                        disabled={isDeleting}
                                    >
                                        <img src="/assets/image/admin/setting/close.svg" alt="삭제" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {isAdding && (
                <div className={styles.inputRow}>
                    <input
                        className={styles.inputField}
                        value={manualInput}
                        type='text'
                        onChange={(event) => setManualInput(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSaveManual();
                            }
                            if (event.key === 'Escape') {
                                setIsAdding(false);
                                setManualInput('');
                            }
                        }}
                        placeholder="번호 입력"
                        autoFocus
                    />
                    <button
                        type="button"
                        className={styles.saveButton}
                        onClick={handleSaveManual}
                        disabled={isPosting}
                    >
                        저장
                    </button>
                </div>
            )}
            {!isErpConnected && (
                <button className={styles.addButton} onClick={handleAddClick} disabled={isAdding || isPosting}>
                    <img src="/assets/image/admin/setting/add.svg" alt="add" />
                    <span>직접 추가</span>
                </button>
            )}
        </div>
    );
};

export default TableNumberList;
