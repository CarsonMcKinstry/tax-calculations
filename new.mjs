import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath  } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, './umsaetze-sparda-2022.csv');

const Umbuchung = "Umbuchung";

(async function main() {
    const csv = await fs.readFile(csvPath, "utf-8");

    let savings = 0;
    let total = 2439.12;

    let max = 0;
    let maxWhen = "";

    const split = csv
        .split('\n')
        .map(row => row.split(";").map(valu => valu.replaceAll('"', "")))
        .map(row => {
            const date = row[0];
            const type = row[2];
            const rawAmount = row[3];
            const [eur, cents] = rawAmount.split(',');

            const amount = `${eur.replaceAll(".", "")}.${cents}`;
           if (Number.isNaN(Number(amount))) {
            console.log('the fuck', amount, date);
           }
            return {
                date, amount: Number(amount),
                type
            }
        })
        .reverse();

    for (const { date, amount, type } of split) {
        if (type === Umbuchung) {
            if (amount < 0) {
                savings += -1 * amount;
                total += amount;
            } else {
                savings -= amount;
                total += amount;
            }
        } else {
            total += amount;
        }

        const t = total + savings;

        if (total > max) {
            max = t;
            maxWhen = date;
        }

    }
    // console.log("end year:", total, max, maxWhen);
    console.log("end year:", total);
    console.log("max:", max, "\non:", maxWhen);
})();