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

// choices prompt
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

// view all departments
const viewAllDepartments=()=>{
    const sql='SELECT * FROM department'
    db.query(sql,(err,res)=>{
        if(err)throw err;
        console.log("Viewing All Departments")
        console.table(res);
        init();
    });
};

// view all roles
const viewAllRoles=()=>{
    const sql=`SELECT title,role_id,department.department_name,salary FROM role
    JOIN department ON role.department_id=department.department_id`
    db.query(sql,(err,res)=>{
        if(err)throw err;
        console.log("Viewing All Roles")
        console.table(res);
        init();
    });
};

// view all employees
const viewAllEmployees=()=>{
    const sql=` SELECT e.employee_id, e.first_name, e.last_name,title,department_name,role.salary,CONCAT(m.first_name,' ',m.last_name)AS Manager FROM employee e
    JOIN role ON e.role_id=role.role_id
    JOIN department on role.department_id=department.department_id
    LEFT OUTER JOIN employee m ON m.employee_id=e.manager_id
    ORDER BY e.last_name;`;
    db.query(sql,(err,res)=>{
        if(err)throw err
        console.log("Viewing All Employees")
        console.table(res)
        init();
    });  
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