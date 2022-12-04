import { Point } from "./Data";

export const highArray = (count: number, allCount: number, basePoint: number, basePrice: number[], array: number[]): Point => {
    for (var i = 0; i < array.length; i++) {
        if (array[i] <= basePrice[basePoint]) {
            count += 1;
        }
    }
    const data: Point = {
        x: basePrice[basePoint],
        y: (count / allCount) * 100
    }
    return data;
}