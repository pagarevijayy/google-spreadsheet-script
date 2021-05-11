const { GoogleSpreadsheet } = require('google-spreadsheet');
const bcrypt = require('bcrypt');
require('dotenv').config();

const spreadsheetId = process.env.SHEET_ID;

//user input data
const emailId = 'abc@xyc.com';
const password = 'hashthispassword';

executeMain(spreadsheetId, emailId, password);


async function executeMain(spreadsheetId, emailId, password) {
	try {

		// Initialize spreadsheet
		const doc = await initSpreadsheet(spreadsheetId);

		//select a sheet
		const sheet = doc.sheetsByTitle['login_credentials'];

		// hash password
		const rounds = 10;
		const hashedpassowrd = await hashPassword(password, rounds);

		await addData(sheet, emailId, hashedpassowrd)

	} catch (error) {
		console.log(error)
	}

}

async function initSpreadsheet(docId) {
	try {
		// Initialize the sheet - doc ID is the long id in the sheets URL
		const document = new GoogleSpreadsheet(docId);

		// Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
		await document.useServiceAccountAuth({
			client_email: process.env.SHEET_EMAIL,
			private_key: process.env.SHEET_API_KEY.replace(/\\n/gm, '\n')
		});

		await document.loadInfo(); // loads document properties and worksheets

		return document
	} catch (error) {
		console.log('sheet initialization error: \n', error)
	}
}

async function addData(sheet, emailId, password) {
	try {
		const response = await sheet.addRow({ Email: emailId, Password: password });
		return response;
	} catch (error) {
		console.log('add data error: \n', error)
	}
}

async function hashPassword(password, rounds) {
	try {
		const hash = await bcrypt.hash(password, rounds);
		return hash;

		// compare hash and password
		// console.log(await bcrypt.compare(password, 'hash'));
	} catch (error) {
		console.log('password hashing error', error)
	}
}