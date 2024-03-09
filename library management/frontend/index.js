document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("employeeForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const empname = document.getElementById("fullName").value;
    const empId = document.getElementById("empId").value;
    const phonenumber = document.getElementById("phonenumber").value;
    const dop = document.getElementById("dop").value;
    console.log(empname, empId, phonenumber, dop);
    console.log("empname element:", document.getElementById("empname"));
    if (
      !empname ||
      !empId ||
      !dop ||
      !phonenumber ) {
      alert("Please fill in all fields");
      return;
    }
    if (empname.length > 30) {
      alert("Name should be within 30 characters");
      return;
    }
    fetch("http://localhost:5002/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        empname: empname,  
        empId: empId,      
        dop: dop,
        phonenumber: phonenumber,  
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        alert(data);
        document.getElementById("employeeForm").reset();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Form submission failed. Please try again.');
      });
  });
});

