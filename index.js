// declare dependencies
const mysql = require('mysql2')
const inquirer = require('inquirer')
const cTable = require('console.table')

//declare variables
let employeeChoices = []
let departmentChoices = []
let roleChoices = []
let managerChoices=[]
let eDept;
let eEmp;
let eRole;

// create connections
const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'$Jobang123195',
        database: 'employeeDB'
    },
    console.log('Connected to the employeeDB \n\n')
)

// initialize program
const init=()=>{
    getEmployee()
    getDepartment()
    getRole()
    startPrompt()
}

// get employee choices array
const getEmployee=()=>{
    const sql = `SELECT CONCAT (first_name, ' ',last_name)as fullName, employee_id, manager_id FROM employee`
    db.query(sql,(err,res)=>{
        managerChoices=['No Manager']
        if (err) throw err
        employeeChoices=res.map(employee=>employee.fullName),
        managerChoices.unshift(...employeeChoices)
        eEmp=res
    });
};
//get department choices array
const getDepartment=()=>{
    const sql = `SELECT * FROM department`
    db.query(sql,(err,res)=>{
        if (err) throw err
        departmentChoices=res.map(department=>department.department_name)
        eDept=res;
      
    })
}
//get role choice array
const getRole=()=>{
    const sql = `SELECT * FROM role`
    db.query(sql,(err,res)=>{
        if (err) throw err
        roleChoices=res.map(role=>role.title)
        eRole=res
    })
}

init();