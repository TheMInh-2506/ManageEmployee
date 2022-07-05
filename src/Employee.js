import React,{Component , useRef, useEffect} from "react";
import {variables} from './Variable.js';
import { format } from 'date-fns'
export class Employee extends Component {
  constructor(props) {
    // Pass props to the parent component
    super(props);
    React.createRef();
    // Set initial state
    this.state = {
      // State needed
      previewImg: null,
      departments: [],
      employees: [],
      modalTitle: "",
      EmployeeID: 0,
      EmployeeName: "",
      Department: "",
      DateJoining: null,
      EmployeeImg: "anonymous.png",
      EmployeeIdFilter: "",
      EmployeeNameFilter: "",
      EmployeesWithoutFilter: [],
      PhotoPath: variables.PHOTO_URL,
    };
  }

  imgPreviewHandel(e) {
    this.setState({
      previewImg: URL.createObjectURL(e.target.files[0]),
      //new
      EmployeeImg: e.target.files[0].name,
      PhotoPath: e.target.files[0],
    });
  }

  imageUpload = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", e.target.files[0], e.target.files[0].name);
    console.log(e.target.files[0]);
    fetch(variables.API_URL + "Employee/Savefile", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ EmployeeImg: data });
      });
  };

  refreshList() {
    fetch(variables.API_URL + "Employee")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ employees: data, EmployeesWithoutFilter: data });
      });

    fetch(variables.API_URL + "Department")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ departments: data });
      });
  }
  componentDidMount() {
    this.refreshList();
  }

  changeEmployeeName = (e) => {
    this.setState({ EmployeeName: e.target.value });
  };
  changeDepartment = (e) => {
    this.setState({ Department: e.target.key });
  };
  changeDateJoining = (e) => {
    this.setState({ DateJoining: e.target.value });
  };

  addClick() {
    this.setState({
      modalTitle: "Add Employee",
      // EmployeeID: null,
      EmployeeName: "",
      Department: 0,
      DateJoining: "",
      EmployeeImg: "anonymous.png",
    });
  }
  editClick(emp) {
    var date = format(new Date(emp.DateJoining), "yyyy-MM-dd");

    this.setState({
      modalTitle: "Edit Employee",
      EmployeeID: emp.EmployeeID,
      EmployeeName: emp.EmployeeName,
      Department: emp.Department,
      DateJoining: date,
      EmployeeImg: emp.EmployeeImg,
      previewImg: variables.PHOTO_URL + emp.EmployeeImg,
    });
  }

  createClick() {
    const formData = new FormData();
    formData.append("file", this.state.PhotoPath, this.state.EmployeeImg);
    fetch(variables.API_URL + "Employee/Savefile", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ EmployeeImg: data });
      });

    var date = new Date(this.state.DateJoining);
    var date1 = date;

    console.log(typeof date);
    fetch(variables.API_URL + "Employee/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        EmployeeName: this.state.EmployeeName,
        Department: this.state.Department,
        DateJoining: this.date1,
        EmployeeImg: this.state.EmployeeImg,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert("Failed");
        }
      );

    this.setState({
      PhotoPath: null,
      previewImg: null,
      EmployeeImg: null,
    });
  }

  updateClick() {
    const formData = new FormData();
    formData.append("file", this.state.PhotoPath, this.state.EmployeeImg);
    fetch(variables.API_URL + "Employee/Savefile", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ EmployeeImg: data, previewImg: null });
      });

    fetch(variables.API_URL + "Employee/edit", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        EmployeeID: this.state.EmployeeID,
        EmployeeName: this.state.EmployeeName,
        Department: this.state.Department,
        DateJoining: new Date(this.state.DateJoining),
        EmployeeImg: this.state.EmployeeImg,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert("Failed");
        }
      );
  }

  deleteClick(id) {
    if (window.confirm("Are you sure?")) {
      fetch(variables.API_URL + "employee/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            alert(result);
            this.refreshList();
          },
          (error) => {
            alert("Failed");
          }
        );
    }
  }

  FilterFn() {
    var EmployeeIdFilter = this.state.EmployeeIdFilter;
    //   var EmployeeNameFilter = this.state.EmployeeNameFilter;

    var filteredData = this.state.EmployeesWithoutFilter.filter(function (el) {
      return el.EmployeeID.toString()
        .toLowerCase()
        .includes(EmployeeIdFilter.toString().trim().toLowerCase());
      //&&
      // el.EmployeeName.toString().toLowerCase().includes(
      //     EmployeeNameFilter.toString().trim().toLowerCase()
      // )
    });
    this.setState({ employees: filteredData });
  }

  sortResult(prop, asc) {
    var sortedData = this.state.EmployeesWithoutFilter.sort(function (a, b) {
      if (asc) {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });

    this.setState({ employees: sortedData });
  }

  changeEmployeeIdFilter = (e) => {
    this.state.EmployeeIdFilter = e.target.value;
    this.FilterFn();
  };
  DepartmentFindNameByID(departments, employees) {
    var props = ["id", "name"];

    var result = departments
      .filter(function (o1) {
        // filter out (!) items in result2
        return !employees.some(function (o2) {
          return o1.DepartmentID === o2.Department; // assumes unique id
        });
      })
      .map(function (o) {
        // use reduce to make objects with only the required properties
        // and map to apply this to the filtered array as a whole
        return props.reduce(function (newo, name) {
          newo[name] = o[name];
          return newo;
        }, {});
      });
  }
  render() {
    const {
      departments,
      employees,
      modalTitle,
      EmployeeID,
      EmployeeName,
      Department,
      DateJoining,
      PhotoPath,
      EmployeeImg,
    } = this.state;

    const imgstyle = {
      width: "75px",
      height: "70px",
      "border-radius": "40%",
    };

    return (
      <div id="employ">
        <button
          type="button"
          className="btn btn-danger m-2 float-end"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => this.addClick()}
        >
          Add Employee
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              {" "}
              <div className="d-flex flex-row">
                <input
                  className="form-control m-2"
                  onChange={this.changeEmployeeIdFilter}
                  placeholder="Filter By ID"
                />

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => this.sortResult("EmployeeID", true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-down-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => this.sortResult("EmployeeID", false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-up-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
                  </svg>
                </button>
              </div>
            </tr>
            <tr>
              <th>EmployeeID</th>
              <th>EmployeeName</th>
              <th>Employee Avatar</th>
              <th>DepartmentID</th>

              <th>DOJ</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.EmployeeID}>
                <td>{emp.EmployeeID}</td>
                <td>{emp.EmployeeName}</td>
                <td>
                  <img
                    style={imgstyle}
                    src={variables.PHOTO_URL + emp.EmployeeImg}
                  />
                </td>
                <td>{emp.Department}</td>
                <td>{format(new Date(emp.DateJoining), "dd-MM-yyyy")}</td>
                <td>
                  <button
                    type="button"
                    autofocus
                    className="btn btn-light mr-1 bg-info"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => this.editClick(emp)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-pencil-square "
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button "
                    className="btn btn-light bg-danger mr-1"
                    onClick={() => this.deleteClick(emp.EmployeeID)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-trash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="d-flex flex-row bd-highlight mb-3">
                  <div className="p-2 w-50 bd-highlight">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Emp Name</span>
                      <input
                        type="text"
                        className="form-control"
                        value={EmployeeName}
                        onChange={this.changeEmployeeName}
                      />
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text">Department</span>
                      <select
                        className="form-select"
                        onChange={this.changeDepartment}
                        value={Department}
                      >
                        {departments.map((dep) => (
                          <option key={dep.DepartmentID}>
                            {dep.DepartmentName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group mb-3">
                      <span className="input-group-text">DOJ</span>
                      <input
                        type="date"
                        className="form-control"
                        autofocus
                        value={DateJoining}
                        onChange={this.changeDateJoining}
                      />
                    </div>
                  </div>

                  <div className="p-2 w-50 bd-highlight">
                    <img
                      width="250px"
                      height="250px"
                      // src={PhotoPath+EmployeeImg}

                      src={
                        this.state.previewImg == null
                          ? variables.PHOTO_URL + this.state.EmployeeImg
                          : this.state.previewImg
                      }
                      alt="imagepreview"
                    />
                    <input
                      className="m-2"
                      type="file"
                      //onChange={this.imageUpload}

                      onChange={this.imgPreviewHandel.bind(this)}
                    />
                  </div>
                </div>

                {EmployeeID == 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={() => this.createClick()}
                  >
                    Create
                  </button>
                ) : null}

                {EmployeeID != 0 ? (
                  <button
                    type="button"
                    className="btn btn-primary float-start"
                    onClick={() => this.updateClick()}
                  >
                    Update
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}