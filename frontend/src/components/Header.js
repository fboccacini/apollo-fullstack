import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { getUser, deleteUser } from '../utils';

const Header = () => {
  const history = useHistory();
  var user_name = null;

  if (getUser()) {
    user_name = getUser().name;
  }
  return (
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <div className="fw7 mr1">Some project</div>
        <Link to="/" className="ml1 no-underline black">
          new
        </Link>
        <div className="ml1">|</div>
        <Link to="/top" className="ml1 no-underline black">
          top
        </Link>
        <div className="ml1">|</div>
        <Link to="/search" className="ml1 no-underline black">
                search
        </Link>
        {user_name && (
          <div className="flex">
            <div className="ml1">|</div>
            <Link
              to="/create"
              className="ml1 no-underline black"
            >
              submit
            </Link>
          </div>
        )}
      </div>
      {user_name && (
        <div
          className="flex flex-fixed black"
        >
          {"Ciao, " + user_name}
        </div>
      )}
      
      <div className="flex flex-fixed">
        {user_name ? (
          <div>
            <div
              className="ml1 pointer black"
              onClick={() => {
                deleteUser();
                user_name = null;
                history.push(`/`);
              }}
            >
              logout
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="ml1 no-underline black"
          >
            login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;