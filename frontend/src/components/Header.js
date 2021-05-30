import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { DeleteUser,GetUser } from '../utils';
import { userVar } from '../cache';

const Header = () => {
  const history = useHistory();
  GetUser();
  const user = useReactiveVar(userVar);
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
        {user && user.logged && (
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
      {user && user.logged && (
        <div
          className="flex flex-fixed black"
        >
          {"Ciao, " + user.name}
        </div>
      )}
      
      <div className="flex flex-fixed">
        {user && user.logged ? (
          <div>
            <div
              className="ml1 pointer black"
              onClick={() => {
                DeleteUser();
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