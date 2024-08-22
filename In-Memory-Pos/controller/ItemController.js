// load all at the beginning
getAllItems();

// get data from selected raw on click
$('#tblItem').on('click', 'tr', function () {
    // Get the data from the selected row
    let itemCode = $(this).find('td:eq(0)').text();
    let itemName = $(this).find('td:eq(1)').text();
    let itemQty = $(this).find('td:eq(3)').text();
    let itemUnitPrice = $(this).find('td:eq(2)').text();

    // Set the values to the fields
    $("#txtItemCode").val(itemCode);
    $("#txtItemName").val(itemName);
    $("#txtItemQTY").val(itemQty);
    $("#txtItemPrice").val(itemUnitPrice);

    changeTextFieldColorsToBack([itemIDField, itemNameField, itemQtyField, itemUnitPriceField]);
});


//  Save item
$("#btnSaveItem").click(function () {
    if (checkValidItem()) {
        let itemCode = $("#txtItemCode").val();
        let itemName = $("#txtItemName").val();
        let itemQty = $("#txtItemQTY").val();
        let itemUnitPrice = $("#txtItemPrice").val();

        const newItem = Object.assign({}, item);
        newItem.code = itemCode;
        newItem.itemName = itemName;
        newItem.qtyOnHand = itemQty;
        newItem.unitPrice = itemUnitPrice;

        if (!checkExistItem(newItem.code)) {
            const itemJson = JSON.stringify(newItem);
            console.log("Item set", itemJson);
            loadAllItemCodes();

            $.ajax({
                url: "http://localhost:8080/item",
                type: "POST",
                data: itemJson,
                headers: {"Content-Type": "application/json"},
                success: (res) => {
                    console.log(JSON.stringify(res));
                    Swal.fire({
                        title: "Saved Successfully",
                        text: "",
                        icon: "success"
                    });
                    getAllItems();
                    clearAllItemFields();
                },
                error: (res) => {
                    console.error(res);
                    Swal.fire({
                        title: "Oops Failed",
                        text: "An error occurred while saving the item",
                        icon: "error"
                    });
                }
            });
        } else {
            alert("Same Code !");
        }
    } else {
        Swal.fire({
            title: "Oops Failed",
            text: "Invalid Item type",
            icon: "error"
        });
    }

    $("#txtItemCode").focus();
});

// update customer
$('#btnUpdateItem').click(function () {
    if (checkValidItem()) {
        // Get data
        let itemCode = $("#txtItemCode").val();
        let itemName = $("#txtItemName").val();
        let itemQty = $("#txtItemQTY").val();
        let itemUnitPrice = $("#txtItemPrice").val();

        let itemData = {
            code: itemCode,
            itemName: itemName,
            qtyOnHand: itemQty,
            unitPrice: itemUnitPrice
        };


        let confirmUpdate = confirm("Do you want to update this item?");
        if (confirmUpdate){
            $.ajax({
                url: "http://localhost:8080/item", // Assuming the endpoint is /customer
                type: "PUT", // Use PUT method
                contentType: "application/json",
                data: JSON.stringify(itemData), // Convert JS object to JSON
                success: function (response) {
                    Swal.fire({
                        title: "Updated",
                        text: "",
                        icon: "success"
                    })
                    getAllItems(); // Refresh the item table
                    clearAllItemFields(); // Clear input fields
                },
                error: function (xhr, status, error) {
                    console.error("Failed to update item:", error);
                    alert("Failed to update !");
                }
            });
        }
    } else {
        alert("Invalid item details");
    }
});

function getAllItems() {
    let tBody = $("#tblItem");

    // Clear table
    tBody.empty();

    // Load all values
    $.ajax({
        url: "http://localhost:8080/item", // The URL to the backend endpoint
        type: "GET", // HTTP method
        contentType: "application/json", // Expected response content type
        success: function (items) {
            // Iterate over the list of customers and append each to the table
            for (let i = 0; i < items.length; i++) {
                let tr = $(`<tr>
                                <td>${items[i].code}</td>
                                <td>${items[i].itemName}</td>
                                <td>${items[i].unitPrice}</td>
                                <td>${items[i].qtyOnHand}</td>
                            </tr>`);
                tBody.append(tr);
            }
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch items: ", error);
        }
    });
}

$('#btnSearchItem').click(function () {
    let searchTxt = $("#txtSearchItem").val();
    if (searchTxt !== "") {
        getSearchItem(searchTxt);
    } else {
        alert("Input Data!")
        getAllItems();
    }
});

$('#txtSearchItem').on('keyup', function () {
    let searchTxt = $("#txtSearchItem").val();
    if (searchTxt !== "") {
        getSearchItem(searchTxt);
    } else {
        getAllItems();
    }
});

function getSearchItem(searchTxt) {
    let tBody = $("#tblItem");

    // Clear table
    tBody.empty();

    // Load matching values
    let found = false;
    for (let i = 0; i < itemDB.length; i++) {
        if (
            searchTxt.includes(itemDB[i].code) ||
            searchTxt.includes(itemDB[i].itemName) ||
            searchTxt.includes(itemDB[i].qtyOnHand) ||
            searchTxt.includes(itemDB[i].unitPrice)
        ) {
            let tr = $(`<tr>
                            <td>${itemDB[i].code}</td>
                            <td>${itemDB[i].itemName}</td>
                            <td>${itemDB[i].qtyOnHand}</td>
                            <td>${itemDB[i].unitPrice}</td>
                        </tr>`);
            tBody.append(tr);
            found = true;
        }
    }

    if (!found) {
        getAllItems();
    }
}


// button cancel , clear fields
$('#btnCancelItem').click(function () {
    clearAllItemFields();
});

function clearAllItemFields() {
    $("#txtItemCode").val("");
    $("#txtItemName").val("");
    $("#txtItemQTY").val("");
    $("#txtItemPrice").val("");

    changeTextFieldColorsToBack([itemIDField, itemNameField, itemQtyField, itemUnitPriceField]);
    customerFormHideErrorMessages();
}

// button delete
$('#btnDeleteItem').click(function () {
    if (checkValidItem()) {
        let selectedID = $("#txtItemCode").val();

        // search matching ID from arraylist, and delete the object with that id
        if (selectedID) {
            let confirmDelete = confirm("Do you want to delete this item ?");
            if (confirmDelete) {
                // Make an AJAX request to delete the customer
                $.ajax({
                    url: "http://localhost:8080/item?code=" + selectedID, // Append the customer ID to the URL
                    type: "DELETE", // Use DELETE method
                    success: function (response) {
                        /*alert(response); */// Notify the user about the deletion status
                        Swal.fire({
                            title: "Deleted",
                            text: "",
                            icon: "success"
                        })
                        getAllItems(); // Refresh the item table
                        clearAllItemFields(); // Clear input fields
                    },
                    error: function (xhr, status, error) {
                        console.error("Failed to delete item:", error);
                        alert("Failed to delete item!");
                    }
                });
            }
        } else {
            alert("No item selected!");
        }
    } else {
        alert("Invalid item details ! Please check your inputs .");
    }
    // update table
    clearAllItemFields()
});

// check customer is exists
function checkExistItem(code) {
    for (let i = 0; i < itemDB.length; i++) {
        if (code === itemDB[i].code) {
            return true;
        }
    }
    return false;
}

// refresh
$('#btnRefreshItem').click(function () {
    getAllItems();
});
