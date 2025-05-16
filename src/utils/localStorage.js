export const getEmail = () => {
    const { email } = JSON.parse(localStorage.getItem('user')) || {};
    if (email) {
        return email;
    } else {
        console.error('Email not found in local storage');
        return null;
    }
}
export const getUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        return user;
    } else {
        console.error('User not found in local storage');
        return null;
    }
}
export const setUser = (user) => {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        console.error('Invalid user data');
    }
}
export const getToken = () => {
    const { token } = JSON.parse(localStorage.getItem('user')) || '';
    if (token) {
        return token;
    } else {
        console.error('Token not found in local storage');
        return null;
    }
}
export const isFullAuth = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    if (user.registration_status === "completed" && user.token) {
        return true;
    }
    return false;
}
