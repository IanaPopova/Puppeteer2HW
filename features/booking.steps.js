const puppeteer = require("puppeteer");
const { Given, When, Then, Before, After, setDefaultTimeout } = require("cucumber");
const { clickElement, getText } = require("../lib/commands.js");
const assert = require("assert");

setDefaultTimeout(90000);

let page;

Before(async function () {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("The user is on the cinema main page", async function () {
  await page.goto("https://qamid.tmweb.ru/client/index.php", { timeout: 90000 });
});

When("The user selects a day", async function () {
  await clickElement(page, ".page-nav__day:nth-child(2)");
});

When("The user selects a movie", async function () {
  await clickElement(page, ".movie-seances__time[href='#'][data-seance-id='218']");
});

When("The user selects a regular seat", async function () {
  await clickElement(page, ".buying-scheme__chair_standart:not(.buying-scheme__chair_taken)");
});

When("The user selects a VIP seat", async function () {
  await clickElement(page, ".buying-scheme__chair_vip:not(.buying-scheme__chair_taken)");
});

When("The user sees booking details", async function () {
  await clickElement(page, ".acceptin-button");
  const detailsText = await getText(page, ".ticket__check-title");
  assert.ok(detailsText.includes("Вы выбрали билеты:"), `Expected booking details but got "${detailsText}"`);
});

When("The user confirms the booking", async function () {
  await clickElement(page, ".acceptin-button");
});

When("The user returns to the main page", async function () {
  await page.goto("https://qamid.tmweb.ru/client/index.php", { timeout: 90000 });
});

When("The user chooses the same day and seance", async function () {
  await clickElement(page, ".page-nav__day:nth-child(2)");
  await clickElement(page, ".movie-seances__time[href='#'][data-seance-id='218']");
});

Then("The user sees a confirmation as {string}", async function (expectedText) {
  const actualText = await getText(page, ".ticket__check-title");
  assert.ok(actualText.includes(expectedText), `Expected "${expectedText}" but got "${actualText}"`);
});

Then("The user sees the seat is taken", async function () {
  const takenSeat = await page.$(".buying-scheme__chair_standart.buying-scheme__chair_taken");
  assert.ok(takenSeat, "Seat should be marked as taken");
});

Then("The booking button should be disabled", async function () {
  const isButtonDisabled = await page.$eval(".acceptin-button", (btn) => btn.disabled);
  assert.strictEqual(isButtonDisabled, true, "Booking button should be disabled");
});