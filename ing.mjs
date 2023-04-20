import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath  } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, "./umsaetze-ing-2022.csv");

(async function main() {
    const csv = await fs.readFile(csvPath, "utf-8");
    let max = 0;
    let maxWhen = "";

    const split = csv.split("\n")
        .map(row => row.split(";").map(val => val.replaceAll('"', "")))
        .map((row) => {
            const [buchung,,,,,saldo] = row;

            const [eur, cents] = saldo.split(',');

            const amount = `${eur.replaceAll(".", "")}.${cents}`;

            return {
                date: buchung,
                amount: Number(amount)
            }
        })
        .reverse();

        for (const { date, amount } of split) {
            if (amount > max) {
                max = amount;
                maxWhen = date;
            }
        }

        console.log("Total:", split[0].amount);
        console.log("Max:", max, "\non:", maxWhen);
})();