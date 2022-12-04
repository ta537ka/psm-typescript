export const outputPrice = (x1: number, x2: number, x3: number, x4: number, y1: number, y2: number, y3: number, y4: number): number => {
    // 分母
    const denominator: number = ((y1 - y2) * (x3 - x4)) - ((x1 - x2) * (y3 - y4));
    // 分子
    const molecule: number = ((y3 - y1) * (x1 - x2) * (x3 - x4)) + (x1 * (y1 - y2) * (x3 - x4)) - (x3 * (y3 - y4) * (x1 - x2));
    return molecule / denominator;
}