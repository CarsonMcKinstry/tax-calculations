import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, "./umsaetze.csv");

const Umbuchung = "Umbuchung";

(async function main() {
    const csv = await fs.readFile(csvPath, "utf-8");
    let savings = 0;
    const totalByYear = {};
    const maxSavingsByYear = {};
    const maxByYear = {};

    const split = csv
        .split("\n")
        .map((row) => row.split(";").map((val) => val.replaceAll('"', "")))
        .map((row) => {
            const date = row[0];
            const type = row[2];
            const rawAmount = row[3];

            const [eur, cents] = rawAmount.split(",");

            const amount = `${eur.replaceAll(".", "")}.${cents}`;

            return {
                date,
                amount: Number(amount),
                type,
            };
        })
        .reverse();

    for (const { date, amount, type } of split) {
        const [, , year] = date.split(".");

        if (totalByYear[year] == undefined) {
            totalByYear[year] = totalByYear[year - 1] ?? 0;
        }
        if (maxSavingsByYear[year] == undefined) {
            maxSavingsByYear[year] = 0;
        }

        if (type === Umbuchung) {
            if (amount < 0) {
                savings += -1 * amount;
                totalByYear[year] += amount;
            } else {
                savings -= amount;
                totalByYear[year] += amount;
            }

            if (savings > maxSavingsByYear[year]) {
                maxSavingsByYear[year] = savings;
            }
        } else {
            totalByYear[year] += amount;
        }

        if (maxByYear[year] == undefined) {
            maxByYear[year] = {
                amount: 0,
                when: "",
            };
        }

        const total = totalByYear[year] + savings;
        if (total > maxByYear[year].amount) {
            maxByYear[year].amount = total;
            maxByYear[year].when = date;
        }
    }
    console.log(maxSavingsByYear);
    console.log(totalByYear);
    console.log(maxByYear);
})();
