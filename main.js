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

  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Would you like to do?",
      choices: ["View All Employees", "View All Roles", "View All Departments", "Add Employee", "Add Department", "Add Role", "Update an Employee Role", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, call the function to handle the action
      // console.log(answer);
      switch (answer.action) {
        case "View All Employees":
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
        case "Add Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
          break;
        case "Exit":
          console.log("Exiting System....Goodbye!")
          action = "exit";
        // connection.end();
        default:
          // action = "exit";
          connection.end();
      }
    });
  // }
}




function showAllEmployees() {
  // console.log("show alle empl");
  const queryString = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id  LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id";

  connection.query(queryString, function (err, res) {
    if (err) throw err;
    // console.log(res);
    console.table(res);
    start();
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
    start();
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




function addEmployee() {



  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;

    newEmployee = [];

    // connection.query("SELECT * FROM employee", function (err, empdata) {
    //   if (err) throw err;

    // once you have the roles, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the first name of the new employee?"
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the last name of the new employee?"
        },
        {
          name: "role",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              // console.log("i =" + i + " name="+  results[i].name);
              choiceArray.push(results[i].title);
            }
            return choiceArray;
          },
          message: "What role would you like to add the employes?"
        }

      ])
      .then(function (answer) {
        // get the information of the role chose
        var title;
        var role_id;
        console.log(answer.role);
        for (var i = 0; i < results.length; i++) {
          console.log(results[i]);
          if (results[i].title === answer.role) {

            title = results[i].title;
            // dept_id = results[i].department_id;
            role_id = results[i].id;
          }
        }
        
        console.log("New Employee Name: " + answer.first_name + " " + answer.last_name);
        console.log("The title of role is: " + title);
        console.log("The role id = " + role_id);
        newEmployee.first_name = answer.first_name;
        newEmployee.last_name = answer.last_name;
        newEmployee.role_id = role_id;

        // console.log(newEmployee);

        // Select the manager from the employee table
        connection.query("SELECT * FROM employee", function (err, empdata) {
          if (err) throw err;
          // console.log("empdata");
          // console.log(empdata);

          inquirer
            .prompt({

              name: "manager",
              type: "rawlist",
              choices: function () {
                var choiceArray2 = [];
                for (var i = 0; i < empdata.length; i++) {
                  console.log(empdata);
                  // console.log("i =" + i + empdata[i]);
                  var mgr_name = empdata[i].first_name + " " + empdata[i].last_name;
                  console.log("i=" + i + " name = " + mgr_name);
                  choiceArray2.push(mgr_name);
                }
                choiceArray2.push("No Manager");
                return choiceArray2;
              },
              message: "Who is the employees manager?"
            }).then(function (answer2) {
              console.log("answer2");
              console.log(answer2.manager);
              // get the information of the role chose
              var manager = "";
              var mgr_id = null;
              console.log(answer2.manager);

              for (var i = 0; i < empdata.length; i++) {
                // console.log(empdata[i]);
                var tempmgr = empdata[i].first_name + " " + empdata[i].last_name;
                // console.log("i = " + i + " manager= " + manager);
                if (tempmgr === answer2.manager) {
                  console.log("manager matched");
                  // manager = empdata[i].first_name + " " + empdata[i].last_name;
                  manager = empdata[i].first_name + " " + empdata[i].last_name
                  mgr_id = empdata[i].id;
                }
              }


              console.log("The Manager is: " + manager + "id:" + mgr_id);
              newEmployee.manager_id = mgr_id;
              console.log(newEmployee);
              console.log("Inserting a new employee...\n");
              //change role_id = int
              let introle_id = parseInt(newEmployee.role_id);
              var query = connection.query(
                "INSERT INTO employee SET ?",
                {
                  first_name: newEmployee.first_name,
                  last_name: newEmployee.last_name,
                  role_id: introle_id,
                  manager_id: newEmployee.manager_id
                },
                function (err, res) {
                  1
                  if (err) throw err;
                  console.log(res.affectedRows + " employee inserted!\n");
                  // Call showAllEmployees AFTER the INSERT completes
                  showAllEmployees();



                  // logs the actual query being run
                  console.log(query.sql);
                  start();
                });

            });
        });

      });

  })

}



// function addRole() {
//   console.log("addrole");
//   // query the database for all department Ids
//   connection.query("SELECT * FROM department", function (err, empdata) {
//     if (err) throw err;
//     // once you have the roles, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt({

//         name: "employee",
//         type: "rawlist",
//         choices: function () {
//           var choiceArray2 = [];
//           for (var i = 0; i < empdata.length; i++) {
//             console.log(empdata);
//             // console.log("i =" + i + empdata[i]);
//             var emp_name = empdata[i].first_name + " " + empdata[i].last_name;
//             console.log("i=" + i + " name = " + emp_name);
//             choiceArray2.push(emp_name);
//           }

//           return choiceArray2;
//         },
//         message: "Which employee would you like to update?"
//       }).then(function (answer2) {
//         console.log("answer2");
//         console.log(answer2.employee);

//         // get the information of the chosen item
//         var chosenItem;
//         // var role_id;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].name === answer.choice) {
//             chosenItem = results[i].name;
//             dept_id = results[i].id;
//           }
//         }

//         //convert salary from string to decimal
//         let salary = parseFloat(answer.salary).toFixed(2);

//         console.log("The new title of role is: " + answer.title);
//         console.log("The salary is: " + salary);
//         console.log("The department id: " + dept_id + ": " + chosenItem);
//         showAllRoles();

//       });
//   });
// }

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
        var role_id;
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

        //Insert data into role table
        var query = connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: salary,
            department_id: dept_id,
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

function updateEmployeeRole() {

  updateEmployee = [];
  let employee = "";
  const queryString = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id  LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id";

  connection.query(queryString, function (err, empdata) {
    if (err) throw err;

    console.table(empdata);
    inquirer
      .prompt({

        name: "employee",
        type: "rawlist",
        choices: function () {
          var choiceArray2 = [];
          for (var i = 0; i < empdata.length; i++) {
            // console.log(empdata);
            // console.log("i =" + i + empdata[i]);
            var emp_name = empdata[i].first_name + " " + empdata[i].last_name;
            console.log("i=" + i + " name = " + emp_name);
            choiceArray2.push(emp_name);
          }

          return choiceArray2;
        },
        message: "Which employee would you like to update the role?"
      }).then(function (answer2) {
        console.log("answer2");
        console.log(answer2);
        console.log("empdata");
        console.log(empdata);
        for (var i = 0; i < empdata.length; i++) {
          // console.log(empdata[i]);
          var tempemp = empdata[i].first_name + " " + empdata[i].last_name;
          console.log("i = " + i + " employee= " + tempemp);
          if (tempemp === answer2.employee) {
            console.log("employee matched");
            console.log("matched " + tempemp);
            // manager = empdata[i].first_name + " " + empdata[i].last_name;
            employee = tempemp;
            emp_id = empdata[i].id;
            updateEmployee.emp_id = emp_id;
          }
        }
        console.log("updateEmployee")
        console.log(updateEmployee);

        connection.query("SELECT * FROM role", function (err, results) {
          if (err) throw err;
      
           // once you have the roles, prompt the user for which they'd like to bid on
          inquirer
            .prompt([
              {     
                name: "role",
                type: "rawlist",
                choices: function () {
                  var choiceArray = [];
                  for (var i = 0; i < results.length; i++) {
                    // console.log("i =" + i + " name="+  results[i].name);
                    choiceArray.push(results[i].title);
                  }
                  return choiceArray;
                },
                message: "What is the employees new role?"
              }
      
            ])
            .then(function (answer) {
              // get the information of the role chosen
             var newrole_id;
              console.log(answer.role);
              for (var i = 0; i < results.length; i++) {
                // console.log(results[i]);
                if (results[i].title === answer.role) {
                  console.log("title roles matched" +results[i].title );
                  title = results[i].title;
                  // dept_id = results[i].department_id;
                  newrole_id = results[i].id;
                  updateEmployee.new_roleid = newrole_id;
                  console.log(  updateEmployee.new_roleid);
                }
              }
      
               console.log("update employee after role picked");
               console.log(updateEmployee);
               console.log("Employee " + employee + " new role is " + title);
             
            });
          });
  
        });
  
    })
  
  }