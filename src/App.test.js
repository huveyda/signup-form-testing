import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import {type} from "@testing-library/user-event/dist/type";

beforeEach(() => {
    render(<App />)
});

const typeIntoForm = ({email, password, confirmPassword}) => {
    const emailInputElement = screen.getByRole("textbox", {
        name: /email/i,
    });
    const passwordInputElement = screen.getByLabelText("Password");
    const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
    if(email) {
        userEvent.type(emailInputElement, email)
    }
    if(password) {
        userEvent.type(passwordInputElement, password)
    }
    if(confirmPassword) {
        userEvent.type(confirmPasswordInputElement, confirmPassword)
    }

    return {
        emailInputElement,
        passwordInputElement,
        confirmPasswordInputElement
    }

}

const clickOnSubmitButton = () => {
    const submitBtnElement = screen.getByRole("button",{
        name: /submit/i
    });
    userEvent.click(submitBtnElement);
}


test ("input should be initial empty", () => {
    const emailInputElement = screen.getByRole("textbox");
    const passwordInputElement = screen.getByLabelText("Password");
    const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
    expect(emailInputElement.value).toBe("");
    expect(passwordInputElement.value).toBe("");
    expect(confirmPasswordInputElement.value).toBe("");
});

test ("should be able to type an email",() => {
    const {emailInputElement} = typeIntoForm({email: "selena@gmail.com"})
    expect(emailInputElement.value).toBe("selena@gmail.com");
});

test ("should be able to type a password",() =>{
    const {passwordInputElement} = typeIntoForm({password:"password!"})
    expect(passwordInputElement.value).toBe("password!")
});

test ("should be able to type a confirm password",() => {
    const {confirmPasswordInputElement} = typeIntoForm({confirmPassword:"password!"})
    expect(confirmPasswordInputElement.value).toBe("password!")
});

test ("should show email error message on invalid email",() => {
    const emailErrorElement = screen.queryByText(/the email you input is invalid/i);
    expect(emailErrorElement).not.toBeInTheDocument();

    typeIntoForm({
        email: "selenagmail.com"
    })
    clickOnSubmitButton()

    const emailErrorElementAgain = screen.queryByText(/the email you input is invalid/i)
    expect(emailErrorElementAgain).toBeInTheDocument()
})

test ("should show password error if password less than 5 character",() => {
    const passwordErrorElement = screen.queryByText(/the password you enreted should contain 5 or more character/i);

    typeIntoForm({email:"selena@gmail.com"})
    expect(passwordErrorElement).not.toBeInTheDocument();

    typeIntoForm({password:"123"})
    clickOnSubmitButton()
    const passwordErrorElementAgain = screen.queryByText(/the password you enreted should contain 5 or more characters/i);
    expect(passwordErrorElementAgain).toBeInTheDocument();
})

test ("should show confirm password error if password don't match",() => {
    const confirmPasswordErrorElement = screen.queryByText(/the password don't match. try again/i);

    typeIntoForm({
        email:"selena@gmail.com",
        password:"12345"
    })
    expect(confirmPasswordErrorElement).not.toBeInTheDocument();

    typeIntoForm({confirmPassword:"123456"})
    clickOnSubmitButton()
    const confirmPasswordErrorElementAgain = screen.queryByText(/the password don't match. try again/i);
    expect(confirmPasswordErrorElementAgain).toBeInTheDocument();
})

test ("should show no error message if everything is OK",() => {
    typeIntoForm({
        email:"selena@gmail.com",
        password:"12345",
        confirmPassword:"12345"
    })
   clickOnSubmitButton();

    const emailErrorElement = screen.queryByText(/the email you input is invalid/i)
    const passwordErrorElement = screen.queryByText(/the password you enreted should contain 5 or more character/i);
    const confirmPasswordErrorElementAgain = screen.queryByText(/the password don't match. try again/i);

    expect(emailErrorElement).not.toBeInTheDocument();
    expect(passwordErrorElement).not.toBeInTheDocument();
    expect(confirmPasswordErrorElementAgain).not.toBeInTheDocument();
})

