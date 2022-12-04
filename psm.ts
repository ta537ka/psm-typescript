import { readFileSync } from "fs";
import { parse } from 'csv-parse/sync';
import { Data, Point } from "./Data";
import { highArray } from "./HighArray";
import { lowArray } from "./LowArray";
import { outputPrice } from './OutputFunc';

// ファイル名
const FILENAME: string = __dirname + '/' + process.argv[3] + '.csv';
// 最高価格
let maxPrice: number = 0;
// 妥協価格
let compromisePrice: number = 0;
// 理想価格
let thoereticalPrice: number = 0;
// 最低品質保証価格
let minPrice: number = 0;
// 基準点
const basePrice: number[] = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
const basePoint: number = (basePrice.length / 2) - 1;

// 変数定義
let id: number[] = [];
let tooHigh: number[] = [];
let tooLow: number[] = [];
let high: number[] = [];
let low: number[] = [];
let allData: Data[] = [];
let left_xy1: Point = { x: 0, y: 0 };
let left_xy2: Point = { x: 0, y: 0 };
let right_xy1: Point = { x: 0, y: 0 };
let right_xy2: Point = { x: 0, y: 0 };

// csvのデータを配列に格納
const inputArray = (records: number[][]) => {
    const j: number = 1;
    for (let i = 1; i < records.length; i++) {
        id[i - j] = records[i][0];
        high[i - j] = records[i][1];
        low[i - j] = records[i][2];
        tooHigh[i - j] = records[i][3];
        tooLow[i - j] = records[i][4];
        allData.push({
            id: id[i - j],
            high: high[i - j],
            low: low[i - j],
            tooHigh: tooHigh[i - j],
            tooLow: tooLow[i - j]
        });
    }
}

const outputMaxPrice = (recordCount: number): number => {
    let tooHighCount: number = 0;
    let lowCount: number = 0;
    // 高すぎる
    left_xy1 = highArray(tooHighCount, recordCount, basePoint - 1, basePrice, tooHigh);
    right_xy1 = highArray(tooHighCount, recordCount, basePoint, basePrice, tooHigh);
    // 安い
    left_xy2 = lowArray(lowCount, recordCount, basePoint - 1, basePrice, low);
    right_xy2 = lowArray(lowCount, recordCount, basePoint, basePrice, low);
    //最大価格
    maxPrice = outputPrice(left_xy1.x, right_xy1.x, left_xy2.x, right_xy2.x, left_xy1.y, right_xy1.y, left_xy2.y, right_xy2.y);
    return maxPrice;
}

// 妥協価格の出力
const outputCompromisePrice = (recordCount: number): number => {
    let highCount: number = 0;
    let lowCount: number = 0;
    // 高い
    left_xy1 = highArray(highCount, recordCount, basePoint - 1, basePrice, high);
    right_xy1 = highArray(highCount, recordCount, basePoint, basePrice, high);
    // 安い
    left_xy2 = lowArray(lowCount, recordCount, basePoint - 1, basePrice, low);
    right_xy2 = lowArray(lowCount, recordCount, basePoint, basePrice, low);
    // 妥協価格
    compromisePrice = outputPrice(left_xy1.x, right_xy1.x, left_xy2.x, right_xy2.x, left_xy1.y, right_xy1.y, left_xy2.y, right_xy2.y);
    return compromisePrice;
}

// 理想価格
const outputThoereticalPrice = (recordCount: number): number => {
    let tooHighCount: number = 0;
    let tooLowCount: number = 0;
    // 高すぎる
    left_xy1 = highArray(tooHighCount, recordCount, basePoint - 1, basePrice, tooHigh);
    right_xy1 = highArray(tooHighCount, recordCount, basePoint, basePrice, tooHigh);
    // 安すぎる
    left_xy2 = lowArray(tooLowCount, recordCount, basePoint - 1, basePrice, tooLow);
    right_xy2 = lowArray(tooLowCount, recordCount, basePoint, basePrice, tooLow);
    // 理想価格
    thoereticalPrice = outputPrice(left_xy1.x, right_xy1.x, left_xy2.x, right_xy2.x, left_xy1.y, right_xy1.y, left_xy2.y, right_xy2.y);
    return thoereticalPrice;
}

const outputMinPrice = (recordCount: number): number => {
    let highCount: number = 0;
    let tooLowCount: number = 0;
    // 高い
    left_xy1 = highArray(highCount, recordCount, basePoint - 1, basePrice, high);
    right_xy1 = highArray(highCount, recordCount, basePoint, basePrice, high);
    // 安すぎる
    left_xy2 = lowArray(tooLowCount, recordCount, basePoint - 1, basePrice, tooLow);
    right_xy2 = lowArray(tooLowCount, recordCount, basePoint, basePrice, tooLow);
    // 最低品質保証価格
    minPrice = outputPrice(left_xy1.x, right_xy1.x, left_xy2.x, right_xy2.x, left_xy1.y, right_xy1.y, left_xy2.y, right_xy2.y);
    return minPrice;
}

function main() {
    // csvからデータ取得
    const data = readFileSync(`${FILENAME}`);
    const records: number[][] = parse(data);
    // データ総数
    const recordCount: number = records.length - 1;
    // csvのデータを配列に格納
    inputArray(records);
    // 最高価格
    maxPrice = outputMaxPrice(recordCount);
    // 妥協価格
    compromisePrice = outputCompromisePrice(recordCount);
    // 理想価格
    thoereticalPrice = outputThoereticalPrice(recordCount);
    // 最低品質保証価格
    minPrice = outputMinPrice(recordCount);

    // 各価格の出力
    console.log("最高価格 : " + Math.ceil(maxPrice) + "円");
    console.log("妥協価格 : " + Math.ceil(compromisePrice) + "円");
    console.log("理想価格 : " + Math.ceil(thoereticalPrice) + "円");
    console.log("最低品質保証価格 : " + Math.ceil(minPrice) + "円");
}

if (require.main === module) {
    main();
}