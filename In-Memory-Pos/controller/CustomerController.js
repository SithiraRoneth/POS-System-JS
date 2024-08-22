/*const lastCID = getLastCustomerID();
generateCustomerID(lastCID);

function getLastCustomerID(){
    if (customerDB.length>0){
        return customerDB[customerDB.length - 1].id;
    }else {
        return 'C00-001';
    }
}
function generateCustomerID(lastCID){
    const lastCNum = parseInt(lastCID.split('-')[1]);
    const nextCusNumber = lastCID + 1;
    const paddedCusNum = String(nextCusNumber).padStart(3,'0');
    const nextCusID = `C00-${paddedCusNum}`;
    $('#GeneratedOrderID')
}*/
// load all at the beginning
getAllCustomers();

// get data from selected raw on click
$('#tblCustomer').on('click', 'tr', function () {
    // Get the data from the selected row
    let customerId = $(this).find('td:eq(0)').text();
    let customerName = $(this).find('td:eq(1)').text();
    let customerAddress = $(this).find('td:eq(2)').text();
    let customerSalary = $(this).find('td:eq(3)').text();

    // Set the values to the fields
    $("#txtCustomerID").val(customerId);
    $("#txtCustomerName").val(customerName);
    $("#txtCustomerAddress").val(customerAddress);
    $("#txtCustomerSalary").val(customerSalary);

    changeTextFieldColorsToBack([customerIDField, customerNameField, customerAddressField, customerSalaryField]);

});

//  Save customer
$("#btnSaveCustomer").click(function () {
    if (checkValidCustomer()) {
        let customerID = $("#txtCustomerID").val();
        let customerName = $("#txtCustomerName").val();
        let customerAddress = $("#txtCustomerAddress").val();
        let customerSalary = $("#txtCustomerSalary").val();

        const newCustomer = Object.assign({}, customer);
        newCustomer.id = customerID;
        newCustomer.name = customerName;
        newCustomer.address = customerAddress;
        newCustomer.salary = customerSalary;

        if (!checkExistCustomer(newCustomer.id)) {
            const customerJson = JSON.stringify(newCustomer);
            console.log(customerJson)
            loadAllCusIDs();

            $.ajax({
                url: "http://localhost:8080/customer",
                type: "POST",
                data: customerJson,
                headers: {"Content-Type": "application/json"},
                success: (res) => {
                    console.log(JSON.stringify(res))
                    Swal.fire({
                        title: "Saved Successfully",
                        text: "",
                        icon: "success"
                    })
                    getAllCustomers()
                },
                error: (res) => {
                    console.error(res)
                    Swal.fire({
                        title: "Oops Failed",
                        text: "Invalid Customer type",
                        icon: "error"
                    })
                }
            })
        } else {
            Swal.fire({
                title: "Same Customer Id",
                showClass: {
                    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
                },
                hideClass: {
                    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
                }
            });
        }
    } else {
        Swal.fire({
            title: "Oops Failed",
            text: "Invalid Customer type",
            icon: "error"
        })
    }

    getAllCustomers();
    clearAllCustomerFields();

    $("#txtCustomerID").focus();
});

// update customer
/*$('#btnUpdateCustomer').click(function () {
    if (checkValidCustomer()) {
        // Get data
        let id = $("#txtCustomerID").val();
        let name = $("#txtCustomerName").val();
        let address = $("#txtCustomerAddress").val();
        let salary = $("#txtCustomerSalary").val();

        // Set new data to existing object (using id)
        for (let i = 0; i < customerDB.length; i++) {
            if (id === customerDB[i].id) {
                // Confirm update
                let confirmUpdate = confirm("Do you want to update?");

                if (confirmUpdate) {
                    // Update the object in the array
                    customerDB[i].name = name;
                    customerDB[i].address = address;
                    customerDB[i].salary = salary;

                    loadAllCusIDs();
                    // Exit the loop
                    break;
                }
            }
        }
    } else {
        alert("Try again !");
    }
    getAllCustomers();
    clearAllCustomerFields();
});*/
$('#btnUpdateCustomer').click(function () {
    if (checkValidCustomer()) {
        // Get data
        let id = $("#txtCustomerID").val();
        let name = $("#txtCustomerName").val();
        let address = $("#txtCustomerAddress").val();
        let salary = $("#txtCustomerSalary").val();

        // Create the customer object to send to the server
        let customerData = {
            id: id,
            name: name,
            address: address,
            salary: salary
        };

        // Confirm update
        let confirmUpdate = confirm("Do you want to update this customer?");
        if (confirmUpdate) {
            // Make an AJAX request to update the customer
            $.ajax({
                url: "http://localhost:8080/customer", // Assuming the endpoint is /customer
                type: "PUT", // Use PUT method
                contentType: "application/json",
                data: JSON.stringify(customerData), // Convert JS object to JSON
                success: function (response) {
                    Swal.fire({
                        title: "Updated",
                        text: "",
                        icon: "success"
                    })
                    getAllCustomers(); // Refresh the customer table
                    clearAllCustomerFields(); // Clear input fields
                },
                error: function (xhr, status, error) {
                    console.error("Failed to update customer:", error);
                    alert("Failed to update customer!");
                }
            });
        }
    } else {
        alert("Invalid customer details! Please check your inputs.");
    }
});


/*function getAllCustomers() {
    let tBody = $("#tblCustomer");

    // Clear table
    tBody.empty();

    // Load all values
    for (let i = 0; i < customerDB.length; i++) {
        let tr = $(`<tr>
                        <td>${customerDB[i].id}</td>
                        <td>${customerDB[i].name}</td>
                        <td>${customerDB[i].address}</td>
                        <td>${customerDB[i].salary}</td>
                   </tr>`);
        tBody.append(tr);
    }
}*/

function getAllCustomers() {
    let tBody = $("#tblCustomer");

    // Clear table
    tBody.empty();

    // Make an AJAX request to the backend to get all customers
    $.ajax({
        url: "http://localhost:8080/customer", // The URL to the backend endpoint
        type: "GET", // HTTP method
        contentType: "application/json", // Expected response content type
        success: function (customers) {
            // Iterate over the list of customers and append each to the table
            for (let i = 0; i < customers.length; i++) {
                let tr = $(`<tr>
                                <td>${customers[i].id}</td>
                                <td>${customers[i].name}</td>
                                <td>${customers[i].address}</td>
                                <td>${customers[i].salary}</td>
                            </tr>`);
                tBody.append(tr);
            }
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch customers: ", error);
        }
    });
}


$('#btnSearchCustomer').click(function () {
    let searchTxt = $("#txtSearchCus").val();
    if (searchTxt !== "") {
        getSearchCustomer(searchTxt);
    } else {
        alert("Input Data!")
        getAllCustomers();
    }
});

$('#txtSearchCus').on('keyup', function () {
    let searchTxt = $("#txtSearchCus").val();
    if (searchTxt !== "") {
        getSearchCustomer(searchTxt);
    } else {
        getAllCustomers();
    }
});

function getSearchCustomer(searchTxt) {
    let tBody = $("#tblCustomer");

    // Clear table
    tBody.empty();

    // Load matching values
    let found = false;
    for (let i = 0; i < customerDB.length; i++) {
        if (
            searchTxt.includes(customerDB[i].id) ||
            searchTxt.includes(customerDB[i].name) ||
            searchTxt.includes(customerDB[i].address) ||
            searchTxt.includes(customerDB[i].salary)
        ) {
            let tr = $(`<tr>
                            <td>${customerDB[i].id}</td>
                            <td>${customerDB[i].name}</td>
                            <td>${customerDB[i].address}</td>
                            <td>${customerDB[i].salary}</td>
                        </tr>`);
            tBody.append(tr);
            found = true;
        }
    }

    if (!found) {
        getAllCustomers();
    }
}


// button cancel , clear fields
$('#btnCancelCustomer').click(function () {
    clearAllCustomerFields();
});

function clearAllCustomerFields() {
    $("#txtCustomerID").val("");
    $("#txtCustomerName").val("");
    $("#txtCustomerAddress").val("");
    $("#txtCustomerSalary").val("");

    changeTextFieldColorsToBack([customerIDField, customerNameField, customerAddressField, customerSalaryField]);
    customerFormHideErrorMessages();
}

// button delete

$('#btnDeleteCustomer').click(function () {
    if (checkValidCustomer()) {
        let selectedID = $("#txtCustomerID").val();

        if (selectedID) {
            let confirmDelete = confirm("Do you want to delete this customer?");
            if (confirmDelete) {
                // Make an AJAX request to delete the customer
                $.ajax({
                    url: "http://localhost:8080/customer?id=" + selectedID, // Append the customer ID to the URL
                    type: "DELETE", // Use DELETE method
                    success: function (response) {
                        /*alert(response); */// Notify the user about the deletion status
                        Swal.fire({
                            title: "Deleted",
                            text: "",
                            icon: "success"
                        })
                        getAllCustomers(); // Refresh the customer table
                        clearAllCustomerFields(); // Clear input fields
                    },
                    error: function (xhr, status, error) {
                        console.error("Failed to delete customer:", error);
                        alert("Failed to delete customer!");
                    }
                });            }
        } else {
            alert("No customer selected!");
        }
    } else {
        alert("Invalid customer details! Please check your inputs.");
    }
    // update table
    clearAllCustomerFields()
});

// check customer is exists
function checkExistCustomer(id) {
    for (let i = 0; i < customerDB.length; i++) {
        if (id === customerDB[i].id) {
            return true;
        }
    }
    return false;
}

// refresh
$('#btnRefreshCustomer').click(function () {
    getAllCustomers();
});
