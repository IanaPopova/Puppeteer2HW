const { clickElement, getText } = require("./lib/commands.js");

jest.setTimeout(60000);

let page;

const SEANCE_SELECTOR = ".movie-seances__time[href='#'][data-seance-id='218']";

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("https://qamid.tmweb.ru/client/index.php", { timeout: 60000 });
  await clickElement(page, ".page-nav__day:nth-child(2)");
});

afterEach(async () => {
  await page.close();
});

describe("Cinema booking tests", () => {
  test("Should successfully book a regular ticket", async () => {
    await clickElement(page, SEANCE_SELECTOR);
    await clickElement(page, ".buying-scheme__chair_standart:not(.buying-scheme__chair_taken)");
    await clickElement(page, ".acceptin-button");
    await clickElement(page, ".acceptin-button");

    const confirmationText = await getText(page, ".ticket__check-title");

    expect(confirmationText).toContain("Электронный билет");
  }, 60000);

  test("Should successfully book a VIP ticket", async () => {
    await clickElement(page, SEANCE_SELECTOR);
    await clickElement(page, ".buying-scheme__chair_vip:not(.buying-scheme__chair_taken)");
    await clickElement(page, ".acceptin-button");
    await clickElement(page, ".acceptin-button");

    const confirmationText = await getText(page, ".ticket__check-title");

    expect(confirmationText).toContain("Электронный билет");
  }, 60000);

  test("Should not allow booking an already taken seat", async () => {
    await clickElement(page, SEANCE_SELECTOR);
    await clickElement(page, ".buying-scheme__chair_standart:not(.buying-scheme__chair_taken)");
    await clickElement(page, ".acceptin-button");

    await page.goto("https://qamid.tmweb.ru/client/index.php", { timeout: 60000 });
    await clickElement(page, ".page-nav__day:nth-child(2)");
    await clickElement(page, ".movie:nth-child(1) .movie-seances__time");

    const takenSeat = await page.$(".buying-scheme__chair_standart.buying-scheme__chair_taken");
    const isButtonDisabled = await page.$eval(".acceptin-button", (btn) => btn.disabled);

    expect(takenSeat).toBeTruthy();
    expect(isButtonDisabled).toBe(true);
  }, 60000);
});