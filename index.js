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

const addDepartments=()=>{
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept_name',
            message: 'What is the name of the department you want to add?',
            validate: function(dept_name){
                if (dept_name){
                    return true;
                } console.log('Please enter the department name!')
                return false;
            }
        }
    ])
    .then((res)=>{
        const sql = `INSERT INTO department (department_name) VALUES (?)`
        db.query(sql,res.dept_name,(err,result)=>{
            if (err) throw err
            console.log(`\n${res.dept_name} department added!\n`)
            viewAllDepartments()
        });
    });
};

// add a role function
const addRole=()=>{
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the job title of the role?',
            validate: function(title){
                if (title){
                    return true;
                } console.log('Please enter a job title!')
                return false;
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role? (Enter a number amount)',
            validate: function(salary){
                if (salary && isNaN(salary)==false){
                    return true;
                } console.log('Please enter a salary!')
                return false;
            }
        },
        {
            type: 'rawlist',
            name: 'dept_id',
            message: 'Choose the department for the new role',
            choices: departmentChoices
        }
    ])
    .then((res)=>{
        let new_id;
        eDept.map(id=>{
            if(id.department_name===res.dept_id)
            new_id=id.department_id;
            console.log(new_id)
        })
        const sql = `INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`;
        const params = [res.title, res.salary, new_id]
        db.query(sql,params,(err,result)=>{
            if (err) throw err
            console.log(`\n${res.title} added!\n`)
            viewAllRoles()
        });
    });
};

// add new employee function
const addEmployee=()=>{
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstname',
            message: "What is the employee's first name?",
            validate: function(firstname){
                if (firstname){
                    return true;
                } console.log('Please enter a first name!')
                return false;
            }
        },
        {
            type: 'input',
            name: 'lastname',
            message: "What is the employee's last name?",
            validate: function(lastname){
                if (lastname){
                    return true;
                } console.log('Please enter a last name!')
                return false;
            }
        },
        {
            type: 'rawlist',
            name: 'title',
            message: "What is the employee's role?",
            choices: roleChoices
        },
        {
            type: 'rawlist',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: managerChoices
        }
    ])
    .then((res)=>{
        // looping over eEmp and rRole arrays to find corresponding id numbers
        let noManager={
            fullName:'No Manager',
            employee_id:null
        }
        eEmp.push(noManager)
        let m_id;
        eEmp.map(id=>{
            if(id.fullName===res.manager)
            m_id=id.employee_id;
        })
        let new_id;
        eRole.map(id=>{
            if(id.title===res.title)
            new_id=id.role_id
        })
        const sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)`;
        const params = [res.firstname, res.lastname, new_id,m_id]
        db.query(sql,params,(err,result)=>{
            if (err) throw err
            console.log(`\n${res.firstname} ${res.lastname} added!\n`)
            viewAllEmployees()
        });
    });
};

// update employee's role
const updateEmployee=()=>{
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'employeename',
            message: "Which employee's role would you like to update?",
            choices: employeeChoices
        },
        {
            type: 'rawlist',
            name: 'newtitle',
            message: "What is the employee's new role?",
            choices: roleChoices
        }
    ])
    .then((res)=>{
        // looping over eEmp and ERole arrays to find corresponding id numbers
        let e_id;
        eEmp.map(id=>{
            if(id.fullName===res.employeename)
            e_id=id.employee_id;
        })
        let new_id;
        eRole.map(id=>{
            if(id.title===res.newtitle)
            new_id=id.role_id
        })
        const sql = `UPDATE employee SET? WHERE?`;
        const params = [{role_id:new_id},{employee_id:e_id}]
        db.query(sql,params,(err,result)=>{
            if (err) throw err
            console.log(`\n${res.employeename}'s role is updated!\n`)
            viewAllEmployees()
        });
    });
}

// update employee's manager
const updateManager=()=>{
    inquirer.prompt([
        {
            type: 'rawlist',
            name: 'employeename',
            message: "Which employee's manager would you like to update?",
            choices: employeeChoices
        },
        {
            type: 'rawlist',
            name: 'newmanager',
            message: "Who is the new manager?",
            choices: managerChoices
        }
    ])
    .then((res)=>{
        let e_id;
        eEmp.map(id=>{
            if(id.fullName===res.employeename)
            e_id=id.employee_id;
        })
        let noManager={
            fullName:'No Manager',
            employee_id:null
        }
        eEmp.push(noManager)
        let m_id;
        eEmp.map(id=>{
            if(id.fullName===res.newmanager)
            m_id=id.employee_id;
        })
        const sql = `UPDATE employee SET? WHERE?`;
        const params = [{manager_id:m_id},{employee_id:e_id}]
        db.query(sql,params,(err,result)=>{
            if (err) throw err
            console.log(`\n${res.employeename}'s manager is updated!\n`)
            viewAllEmployees()
        });
    });
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