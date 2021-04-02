import { Dropdown, DropdownButton } from "react-bootstrap";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { logout as logoutFunction } from "actions/UserActions";
import { textualRepresentationOfRole } from "service/UserService";

function UserCard({ Nav, logout, user }) {
   return (
      <Dropdown as={Nav.Item}>
         <Dropdown.Toggle
            aria-expanded={false}
            aria-haspopup={true}
            as={Nav.Link}
            data-toggle="dropdown"
            id="navbarDropdownMenuLink"
            variant="default"
            className="m-0"
         >
            <div className="navbar-user-container">
               <img src={user.icon} />
               <span>
                  <div className="username">
                     {user.givenName} {user.familyName}
                  </div>
                  <div className="userType" style={{ fontSize: "0.8em", marginTop: -20 }}>
                     {textualRepresentationOfRole(user.role)}
                  </div>
               </span>
            </div>
         </Dropdown.Toggle>
         <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink" alignRight>
            <Dropdown.Item as={Link} to="/user/user">
               Account
            </Dropdown.Item>
            <Dropdown.Item
               as={Link}
               to="/user/settings"
               onClick={(e) => e.preventDefault()}
            >
               Settings
            </Dropdown.Item>
            <div className="divider"></div>
            <Dropdown.Item href="/user/dashboard" onClick={(e) => logout()}>
               Logout{" "}
            </Dropdown.Item>
         </Dropdown.Menu>
      </Dropdown>
   );
}

const mapDispatchToProps = (dispatch) => {
   return {
      logout: () => {
         dispatch(logoutFunction());
      },
   };
};

const mapStateToProps = (state) => {
   return {
      user: state.combinedUserData.user,
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);