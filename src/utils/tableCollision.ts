import { PlacedTable, TableType } from '@/types';

const baseDimensions: Record<TableType, { width: number; height: number }> = {
    '1x1': { width: 120, height: 120 },
    '1x2': { width: 120, height: 206 },
    '1x3': { width: 120, height: 292 },
    '1x4': { width: 120, height: 380 },
    '1x5': { width: 120, height: 475 },
    '2x1': { width: 206, height: 120 },
    '2x2': { width: 206, height: 206 },
    '3x1': { width: 292, height: 120 },
    '4x1': { width: 380, height: 120 },
    '5x1': { width: 475, height: 120 }
};

export const getTableDimensions = (table: PlacedTable): { width: number; height: number } => {
    const baseDim = baseDimensions[table.type];
    const rotation = table.rotation || 0;
    const isVertical = rotation === 90 || rotation === 270;

    if (isVertical) {
        return {
            width: baseDim.height,
            height: baseDim.width
        };
    }

    return baseDim;
};

export const checkCollision = (
    table1: PlacedTable,
    position1: { x: number; y: number },
    table2: PlacedTable,
    position2: { x: number; y: number }
): boolean => {
    const dim1 = getTableDimensions(table1);
    const dim2 = getTableDimensions(table2);

    const left1 = position1.x;
    const right1 = position1.x + dim1.width;
    const top1 = position1.y;
    const bottom1 = position1.y + dim1.height;

    const left2 = position2.x;
    const right2 = position2.x + dim2.width;
    const top2 = position2.y;
    const bottom2 = position2.y + dim2.height;

    // AABB (Axis-Aligned Bounding Box) 충돌 감지
    return !(
        right1 <= left2 ||
        left1 >= right2 ||
        bottom1 <= top2 ||
        top1 >= bottom2
    );
};

export const isPositionValid = (
    movingTable: PlacedTable,
    newPosition: { x: number; y: number },
    allTables: PlacedTable[]
): boolean => {
    // 다른 테이블들과 충돌 검사
    for (const table of allTables) {
        if (table.id === movingTable.id) continue;

        if (checkCollision(movingTable, newPosition, table, table.position)) {
            return false;
        }
    }

    return true;
};
