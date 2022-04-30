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

const startPrompt=()=>{
    inquirer.prompt([
        {
            type:'rawlist',
            name: 'task',
            message:"What do you want to do?",
            choices:[
                 'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'Delete a Department',
                'Delete a Role',
                'Delete an employee',
                'View by Manager',
                'View by Department',
                'View Budget',
                'Exit'
            ]
        }
    ])
    .then((res)=>{
                    (res.task=='View All Departments')?viewAllDepartments()
                    :(res.task=='View All Employees')?viewAllEmployees()
                    :(res.task=='Add an Employee')?addEmployee()
                    :(res.task=='Update Employee Role')?updateEmployee()
                    :(res.task=='View All Roles')?viewAllRoles()
                    :(res.task=='Add a Role')?addRole()
                    :(res.task=='Add a Department')?addDepartments()
                    :(res.task=='Update Employee Manager')?updateManager()
                    :(res.task=='Delete a Department')?deleteDepartment()
                    :(res.task=='Delete a Role')?deleteRole()
                    :(res.task=='Delete an employee')?deleteEmployee()
                    :(res.task=='View by Manager')?viewByManager()
                    :(res.task=='View by Department')?viewByDepartment()
                    :(res.task=='View Budget')?viewBudget()
                    :console.log('Closing database...'), db.end
    })   
};

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