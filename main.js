var mysql = require("mysql");
var inquirer = require("inquirer");

// let action = "start";

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "teddy",
  database: "devteam_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  // run the start function after the connection is made to prompt the user
  start();
  // console.log("after start is called");
});

// function which prompts the user for what action they should take
function start() {
  // console.log("begin start");
  // while (!(action ==='exit')){
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Would you like to do?",
      choices: ["View All Emloyees", "View All Roles", "View All Departments", "Add Employee", "Add Department", "Add Role", "Update an Employee Role", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, call the function to handle the action
      // console.log(answer);
      switch (answer.action) {
        case "View All Emloyees":
          showAllEmployees();
          // console.log("return from Showall employees");

          break;
        case "View All Roles":
          showAllRoles();
          break;
        case "View All Departments":
          showAllDept();
          break;
        case "Add Department":
          addDept();
          break;
        case "Add Role":
          addRole();
          break;

        case "Exit":
          console.log("Exiting System....Goodbye!")
          action = "exit";
        // connection.end();
        default:
          // connection.end();
          action = "exit";
      }
    });
  // }
}




function showAllEmployees() {
  // connection.query("SELECT * FROM employee", function (err, res) {
  const queryString = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,CONCAT(manager.first_name, ' ', manager.last_name)  AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id";
  connection.query(queryString, function (err, res) {
    if (err) throw err;
    console.log(res);
    console.table(res);
    start();
    // connection.end();
  });
}

function showAllRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    // console.log(res);
    console.table(res);
    // connection.end();
    start();
  });
}

function showAllDept() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    // console.log(res);
    console.table(res);

    //connection.end();

  });
}

function addDept() {
  inquirer
    .prompt({
      name: "dept",
      type: "input",
      message: "What is the name of the new department to be added?"
    })
    .then(function (answer) {
      let newdept = answer.dept;
      connection.query("INSERT INTO department(name) values('" + newdept + "')", function (err, res) {

        if (err) throw err;
        // console.log(res);
        console.log("New department" + newdept + "added");
        // console.table(res);
        connection.end();
      });
      showAllDept();
      start();
    });

}

// function addRole(){
// //  console.log("addrole");
// connection.query("SELECT * FROM department", function (err, results) {
//   if (err) throw err;
//   // once you have the roles, prompt the user for which role they are 
//   inquirer
//     .prompt([
//       {
//         name: "department",
//         type: "rawlist",
//         choices: function () {
//           var choiceArray = [];
//           for (var i = 0; i < results.length; i++) {
//             choiceArray.push(results[i].name);
//           }
//           return choiceArray;
//         }
//       },
//       {
//         name: "title",
//         type: "input",
//         message: "Enter the title?"
//       },
//       {
//         name: "salary",
//         type: "input",
//         message: "Enter the salary in format ex:15000.00"
//       }
//     ])
//     .then(function (answer) {
//       let number = answer.salary;
//       let salary = parseFloat(answer.salary);
//       console.log(salary)
//       salary = Math.round(number * 100) / 100
//       console.log(salary);
//       console.log("title = " + answer.title);
//       console.log("salary = " + salary);
//       //  salary= salary.toFixed(2);
//       //  connection.query("INSERT INTO role(title,salary,department_id) values('" +answer.title  + "',' +salary+'+ answer2.dept_ide)", function (err, res) {

//       //    if (err) throw err;
//       //    // console.log(res);
//       //    console.log("New role added");
//       //    // console.table(res);
//       //    connection.end();
//       //  });
//       //  showAllRoles();
//     });
//   }




function addEmployee() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    // once you have the roles, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the title of the role?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary?"
        },
        {
          name: "choice",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              // console.log("i =" + i + " name="+  results[i].name);
              choiceArray.push(results[i].name);
            }
            return choiceArray;
          },
          message: "What department would you like to add the employes?"
        }
      ])
      .then(function (answer) {
        // get the information of the chosen item
        var chosenItem;
        var dept_id;
        for (var i = 0; i < results.length; i++) {
          if (results[i].name === answer.choice) {
            chosenItem = results[i].name;
            dept_id = results[i].id;
          }
        }

        //convert salary from string to decimal
        let salary = parseFloat(answer.salary).toFixed(2);

        console.log("The new title of role is: " + answer.title);
        console.log("The salary is: " + salary);
        console.log("The department id: " + dept_id + ": " + chosenItem);

        //Insert data into Employee table
        // const query = connection.query(
        //   "INSERT INTO employee SET ?",
        //   {
        //     first_name: "Noah",
        //     last_name: "Bear",
        //     role_id: "4",
        //     manager_id: "1",
        //   },
        //   function (err, res) {
        //     if (err) throw err;
        //     console.log(res.affectedRows + " employee inserted!\n");
        //     // Call updateemployee AFTER the INSERT completes
        //     showEmployees();
        //     start();
           });
      });

  }



 function addRole() {
      // query the database for all department Ids
      connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        // once you have the roles, prompt the user for which they'd like to bid on
        inquirer
          .prompt([
            {
              name: "title",
              type: "input",
              message: "What is the title of the role?"
            },
            {
              name: "salary",
              type: "input",
              message: "What is the salary?"
            },
            {
              name: "choice",
              type: "rawlist",
              choices: function () {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  // console.log("i =" + i + " name="+  results[i].name);
                  choiceArray.push(results[i].name);
                }
                return choiceArray;
              },
              message: "What department would you like to add the employes?"
            }
          ])
          .then(function (answer) {
            // get the information of the chosen item
            var chosenItem;
            var dept_id;
            for (var i = 0; i < results.length; i++) {
              if (results[i].name === answer.choice) {
                chosenItem = results[i].name;
                dept_id = results[i].id;
              }
            } 6

            //convert salary from string to decimal
            let salary = parseFloat(answer.salary).toFixed(2);

            console.log("The new title of role is: " + answer.title);
            console.log("The salary is: " + salary);
            console.log("The department id: " + dept_id + ": " + chosenItem);

            //Insert data into role table
            var query = connection.query(
              "INSERT INTO role SET ?",
              {
                title: answer.title,
                salary: salary,
                department_id: dept_id
              },
              function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " role inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                showAllRoles();
              }
            );






          });
      });
    }
