# Task 04 — Forecast engine (write tests first)
Read: TERAX.md + CAHIER_DES_CHARGES.md section 7 only.
Do:
1. `src/engine/forecast.ts`: `forecast(profile, needs, debts, fromDate, toDate)` -> `DayForecast[]` with `{date, inflow, outflow, balance}`.
   - inflow = `avgDailySales` + unpaid debts whose `promisedDate` equals the day
   - outflow = needs due that day (expand `recurring` weekly/monthly inside the range)
   - balance = previous balance + inflow - outflow, starting from `openingBalance`
2. `redZones(days)` -> list of `{from, to, worstBalance}` for consecutive days with negative balance.
3. Tests in `tests/engine/forecast.test.ts` (write first): no shortfall; shortfall on one given day; two consecutive red days merged in one zone; weekly recurring need counted each week; paid debt ignored.
Done when: `npm test` passes and covers the 5 cases, no import from React/DOM. Commit.
