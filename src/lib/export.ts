import ExcelJS from "exceljs";
import type { Tank, WaterRecord } from "@/lib/types";
import { toneFor, type Tone } from "@/lib/waterQuality";

export type ExportTankData = {
  tank: Tank;
  latestRecord: WaterRecord | null; // 最新の水質状況（期間に関わらず現時点の最新）
  periodRecords: WaterRecord[]; // 選択期間内の記録（新しい順）
};

const REPORT_TITLE = "アクアポニックスPJ";
const SHEET_NAME = "アクポニ管理";
const FILE_NAME = "アクポニ管理.xlsx";
const COLUMN_COUNT = 6;

// アプリの水・緑のトーンに合わせた配色
const COLOR = {
  titleBg: "FF4A7C2F", // leaf-600
  tankHeaderBg: "FF316B82", // water-600
  sectionText: "FF264858", // water-800
  tableHeaderBg: "FFDCEDF1", // water-100
  border: "FFB9DBE3", // water-200
  zebra: "FFF2F9ED", // leaf-50
  white: "FFFFFFFF",
};

const TONE_FILL: Record<Tone, string> = {
  ideal: "FF264858", // water-800（濃い青）
  safe: "FFE2F2D6", // leaf-100（緑）
  danger: "FFFEE2E2", // red-100（赤）
};
const TONE_FONT: Record<Tone, string> = {
  ideal: COLOR.white,
  safe: "FF334E23", // leaf-800
  danger: "FF991B1B", // red-800
};

const thinBorder: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: COLOR.border } },
  left: { style: "thin", color: { argb: COLOR.border } },
  bottom: { style: "thin", color: { argb: COLOR.border } },
  right: { style: "thin", color: { argb: COLOR.border } },
};

function fillCell(cell: ExcelJS.Cell, argb: string) {
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
}

function styleHeaderCell(cell: ExcelJS.Cell) {
  cell.font = { bold: true, color: { argb: COLOR.sectionText } };
  fillCell(cell, COLOR.tableHeaderBg);
  cell.border = thinBorder;
  cell.alignment = { vertical: "middle", horizontal: "center" };
}

function styleValueCell(cell: ExcelJS.Cell, options?: { fillArgb?: string; fontArgb?: string; align?: "left" | "center" }) {
  cell.border = thinBorder;
  cell.alignment = { vertical: "middle", horizontal: options?.align ?? "center", wrapText: true };
  if (options?.fillArgb) fillCell(cell, options.fillArgb);
  if (options?.fontArgb) cell.font = { color: { argb: options.fontArgb } };
}

export async function exportToExcel(tanksData: ExportTankData[], periodLabel: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(SHEET_NAME, { views: [{ showGridLines: false }] });

  sheet.columns = [{ width: 20 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 30 }];

  // タイトル
  sheet.mergeCells(1, 1, 1, COLUMN_COUNT);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = `${REPORT_TITLE}　期間：${periodLabel}`;
  titleCell.font = { bold: true, size: 14, color: { argb: COLOR.white } };
  fillCell(titleCell, COLOR.titleBg);
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 28;

  let row = 3;

  for (const { tank, latestRecord, periodRecords } of tanksData) {
    // 水槽名見出し
    sheet.mergeCells(row, 1, row, COLUMN_COUNT);
    const tankHeaderCell = sheet.getCell(row, 1);
    tankHeaderCell.value = `【${tank.name}】`;
    tankHeaderCell.font = { bold: true, size: 12, color: { argb: COLOR.white } };
    fillCell(tankHeaderCell, COLOR.tankHeaderBg);
    tankHeaderCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    sheet.getRow(row).height = 22;
    row++;

    // 最新の水質状況（ヘッダー行）
    ["最新の水質状況", "PH", "NH3(ppm)", "NO2-(ppm)", "NO3-(ppm)", "水温(℃)"].forEach((text, i) => {
      const cell = sheet.getCell(row, i + 1);
      cell.value = text;
      styleHeaderCell(cell);
    });
    row++;

    // 最新の水質状況（値行、理想/安全/危険で色分け）
    const labelCell = sheet.getCell(row, 1);
    labelCell.value = latestRecord ? `更新日：${latestRecord.record_date}` : "記録なし";
    styleValueCell(labelCell, { align: "left" });

    const qualityValues: [number, "PH" | "NH3" | "NO2-" | "NO3-", number | null][] = [
      [2, "PH", latestRecord?.ph ?? null],
      [3, "NH3", latestRecord?.nh3 ?? null],
      [4, "NO2-", latestRecord?.no2 ?? null],
      [5, "NO3-", latestRecord?.no3 ?? null],
    ];
    for (const [col, label, value] of qualityValues) {
      const cell = sheet.getCell(row, col);
      cell.value = value ?? "";
      if (value !== null) {
        const tone = toneFor(label, value);
        styleValueCell(cell, { fillArgb: TONE_FILL[tone], fontArgb: TONE_FONT[tone] });
      } else {
        styleValueCell(cell);
      }
    }
    const tempCell = sheet.getCell(row, 6);
    tempCell.value = latestRecord?.water_temp ?? "";
    styleValueCell(tempCell);
    row += 2;

    // 期間中に行った日付と作業内容
    const periodLabelCell = sheet.getCell(row, 1);
    periodLabelCell.value = "期間中に行った日付と作業内容";
    periodLabelCell.font = { bold: true, color: { argb: COLOR.sectionText } };
    row++;

    const dateHeaderCell = sheet.getCell(row, 1);
    dateHeaderCell.value = "日付";
    styleHeaderCell(dateHeaderCell);
    sheet.mergeCells(row, 2, row, COLUMN_COUNT);
    const noteHeaderCell = sheet.getCell(row, 2);
    noteHeaderCell.value = "作業内容";
    styleHeaderCell(noteHeaderCell);
    row++;

    if (periodRecords.length === 0) {
      const emptyDateCell = sheet.getCell(row, 1);
      emptyDateCell.value = "（期間内の記録はありません）";
      styleValueCell(emptyDateCell);
      sheet.mergeCells(row, 2, row, COLUMN_COUNT);
      styleValueCell(sheet.getCell(row, 2));
      row++;
    } else {
      periodRecords.forEach((record, i) => {
        const zebraArgb = i % 2 === 1 ? COLOR.zebra : undefined;

        const dateCell = sheet.getCell(row, 1);
        dateCell.value = record.record_date;
        styleValueCell(dateCell, { fillArgb: zebraArgb });

        sheet.mergeCells(row, 2, row, COLUMN_COUNT);
        const noteCell = sheet.getCell(row, 2);
        noteCell.value = record.work_note ?? "";
        styleValueCell(noteCell, { fillArgb: zebraArgb, align: "left" });

        row++;
      });
    }
    row++;

    // まとめ記入欄
    const summaryLabelCell = sheet.getCell(row, 1);
    summaryLabelCell.value = "まとめ";
    summaryLabelCell.font = { bold: true, color: { argb: COLOR.sectionText } };
    row++;

    const summaryStartRow = row;
    const summaryEndRow = row + 2;
    sheet.mergeCells(summaryStartRow, 1, summaryEndRow, COLUMN_COUNT);
    styleValueCell(sheet.getCell(summaryStartRow, 1), { align: "left" });
    sheet.getCell(summaryStartRow, 1).alignment = { vertical: "top", horizontal: "left", wrapText: true };
    for (let r = summaryStartRow; r <= summaryEndRow; r++) {
      sheet.getRow(r).height = 20;
    }
    row = summaryEndRow + 2;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = FILE_NAME;
  link.click();
  URL.revokeObjectURL(url);
}
