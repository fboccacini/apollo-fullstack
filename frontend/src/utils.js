import { gql } from "@apollo/client";
import { userVar } from './cache';
export const USER_KEY = "loggedInUser";
export const TOKEN_KEY = "token";

export function SaveUser(tokens) {
  sessionStorage.setItem(TOKEN_KEY, tokens.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
  userVar({
    name: tokens.user.name,
    logged: true
  });
}

export const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUser {
    loggedInUser {
      name
    }
  }
`;

export function GetUser() {
  const storage_user = sessionStorage.getItem(USER_KEY);
  const usr = JSON.parse(sessionStorage.getItem(USER_KEY));
  if (storage_user) {
    userVar({
      name: usr.name,
      logged: true
    });
  } else {
    userVar({
      name: '',
      logged: false
    });
  }
}

export function DeleteUser() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  userVar({
    name: '',
    logged: false
  });
}

function timeDifference(current, previous) {
  const milliSecondsPerMinute = 60 * 1000;
  const milliSecondsPerHour = milliSecondsPerMinute * 60;
  const milliSecondsPerDay = milliSecondsPerHour * 24;
  const milliSecondsPerMonth = milliSecondsPerDay * 30;
  const milliSecondsPerYear = milliSecondsPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'just now';
  }

  if (elapsed < milliSecondsPerMinute) {
    return 'less than 1 min ago';
  } else if (elapsed < milliSecondsPerHour) {
    return (
      Math.round(elapsed / milliSecondsPerMinute) +
      ' min ago'
    );
  } else if (elapsed < milliSecondsPerDay) {
    return (
      Math.round(elapsed / milliSecondsPerHour) + ' h ago'
    );
  } else if (elapsed < milliSecondsPerMonth) {
    return (
      Math.round(elapsed / milliSecondsPerDay) + ' days ago'
    );
  } else if (elapsed < milliSecondsPerYear) {
    return (
      Math.round(elapsed / milliSecondsPerMonth) + ' mo ago'
    );
  } else {
    return (
      Math.round(elapsed / milliSecondsPerYear) +
      ' years ago'
    );
  }
}

export function timeDifferenceForDate(date) {
  const now = new Date().getTime();
  const updated = new Date(date).getTime();
  return timeDifference(now, updated);
}
