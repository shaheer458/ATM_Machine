#!/usr/bin/env node
import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from 'chalk';
const log = console.log;
log(chalk.red.bold.bgBlue('welcome to ZBL bank ATM'));
const createUser = () => {
    let users = [];
    for (let i = 0; i < 5; i++) {
        let user = {
            id: i,
            pin: 1000 + i,
            name: faker.person.fullName(),
            accountNo: Math.floor(100000000 * Math.random() * 900000000),
            balance: 100000000 * i,
        };
        users.push(user);
    }
    return users;
};
const atmMachine = async (users) => {
    const res = await inquirer.prompt([
        {
            type: "number",
            message: "please enter your id",
            name: "id"
        },
        {
            type: "number",
            message: "please enter your pin",
            name: "pin"
        }
    ]);
    const user = users.find(val => val.id == res.id);
    if (user) {
        log(chalk.blue.bold(`welcome ${user.name}`));
        atmFunc(user);
        return;
    }
    console.log(chalk.bold.red('Invalid id !'));
    const user1 = users.find(val => val.pin == res.pin);
    if (user1) {
        log(chalk.blue.bold(`${user1.name} pin verified `));
        atmFunc(user1);
        return;
    }
    console.log(chalk.bold.red('Invalid pin !'));
};
const atmFunc = async (user) => {
    let continueOpertions = true;
    do {
        const ans = await inquirer.prompt({
            type: "list",
            name: "select",
            choices: ["Withdraw", "fastCash", "balance", "exit"],
            message: "select an option to proceed"
        });
        if (ans.select === "Withdraw") {
            const amount = await inquirer.prompt({
                type: "number",
                name: "rupee",
                message: "enter your amount"
            });
            if (amount.rupee > user.balance) {
                return console.log(chalk.bold.red('insufficient balance!'));
            }
            else if (amount.rupee <= 50000) {
                console.log(chalk.yellow.bold(`transactions completed withdrawn amount : ${amount.rupee}`));
                console.log(chalk.yellow.bold(`remaining balance ${user.balance - amount.rupee}`));
            }
            else {
                console.log(chalk.red.bold.bgBlue("amount exceed the limit"));
            }
        }
        if (ans.select === "fastCash") {
            const cash = await inquirer.prompt({
                type: "list",
                name: "rupee",
                message: "select amount options",
                choices: ["500", "1000", "2000", "5000", "10000"]
            });
            if (cash.rupee > user.balance) {
                return console.log(chalk.bold.red('insufficient balance!'));
            }
            console.log(chalk.yellow.bold(`transactions completed withdrawn amount : ${cash.rupee}`));
            console.log(chalk.yellow.bold(`remaining balance ${user.balance - cash.rupee}`));
        }
        if (ans.select === "balance") {
            console.log(chalk.green.bold(`your balance ${user.balance}`));
        }
        const { continueOp } = await inquirer.prompt([
            {
                type: "confirm",
                name: "continueOp",
                message: "do you want to perform another transaction",
                default: true
            }
        ]);
        if (ans.select === "exit") {
            console.log(chalk.blue.bold("thank you for using Atm"));
        }
        continueOpertions = continueOp;
    } while (continueOpertions);
};
const users = createUser();
atmMachine(users);
console.log(users);
