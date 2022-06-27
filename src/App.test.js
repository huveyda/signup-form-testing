import { render, screen } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

test ("input should be initial empty", () => {
    render(<App/>);
    const emailInputElement = screen.getByRole("textbox");
    const passwordInputElement = screen.getByLabelText("Password");
    const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
    expect(emailInputElement.value).toBe("");
    expect(passwordInputElement.value).toBe("");
    expect(confirmPasswordInputElement.value).toBe("");

});

test ("should be able to type an email",() => {
    render(<App/>);
    const emailInputElement = screen.getByRole("textbox", {
        name: /email/i,
    });
    userEvent.type(emailInputElement, "selena@gmail.com");
    expect(emailInputElement.value).toBe("selena@gmail.com");
});

test ("should be able to type a password",() =>{
    render(<App />);
    const passwordInputElement = screen.getByLabelText("Password");
    userEvent.type(passwordInputElement,"password!");
    expect(passwordInputElement.value).toBe("password!")
});

test ("should be able to type a confirm password",() => {
    render(<App />);
    const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
    userEvent.type(confirmPasswordInputElement,"password!");
    expect(confirmPasswordInputElement.value).toBe("password!")
});

test ("should show email error message on invalid email",() => {
    render(<App />);

    const emailErrorElement = screen.queryByText(/the email you input is invalid/i);
    const emailInputElement = screen.getByRole("textbox", {
        name: /email/i,
    });
    const submitBtnElement = screen.getByRole("button",{
        name: /submit/i
    });
    expect(emailErrorElement).not.toBeInTheDocument();

    userEvent.type(emailInputElement, "selenagmail.com");
    userEvent.click(submitBtnElement);

    const emailErrorElementAgain = screen.queryByText(/the email you input is invalid/i)
    expect(emailErrorElementAgain).toBeInTheDocument()
})

test ("should show password error if password less than 5 character",() => {
    render(<App />);
    const emailInputElement = screen.getByRole("textbox", {
        name: /email/i,
    });
    const passwordInputElement = screen.getByLabelText("Password");
    const passwordErrorElement = screen.queryByText(/the password you enreted should contain 5 or more character/i);
    const submitBtnElement = screen.getByRole("button",{
        name: /submit/i
    });
    userEvent.type(emailInputElement, "selena@gmail.com");
    expect(passwordErrorElement).not.toBeInTheDocument();
    userEvent.type(passwordInputElement,"123");
    userEvent.click(submitBtnElement);
    const passwordErrorElementAgain = screen.queryByText(/the password you enreted should contain 5 or more characters/i);
    expect(passwordErrorElementAgain).toBeInTheDocument();
})

test ("should show confirm password error if password don't match",() => {
    render(<App />);
    const emailInputElement = screen.getByRole("textbox", {
        name: /email/i,
    });
    const passwordInputElement = screen.getByLabelText("Password");
    const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);
    const confirmPasswordErrorElement = screen.queryByText(/the password don't match. try again/i);
    const submitBtnElement = screen.getByRole("button",{
        name: /submit/i
    });
    userEvent.type(emailInputElement, "selena@gmail.com");
    userEvent.type(passwordInputElement, "12345");
    expect(confirmPasswordErrorElement).not.toBeInTheDocument();

    userEvent.type(confirmPasswordInputElement,"123456");
    userEvent.click(submitBtnElement);
    const confirmPasswordErrorElementAgain = screen.queryByText(/the password don't match. try again/i);
    expect(confirmPasswordErrorElementAgain).toBeInTheDocument();
})

test ("should show no error message if everything is OK",() => {
    render(<App />);
    const emailInputElement = screen.getByRole("textbox", {
        name: /email/i,
    });
    const passwordInputElement = screen.getByLabelText("Password");
    const confirmPasswordInputElement = screen.getByLabelText(/confirm password/i);

    const submitBtnElement = screen.getByRole("button",{
        name: /submit/i
    });

    userEvent.type(emailInputElement, "selena@gmail.com");
    userEvent.type(passwordInputElement, "12345");
    userEvent.type(confirmPasswordInputElement, "12345");
    userEvent.click(submitBtnElement);

    const emailErrorElement = screen.queryByText(/the email you input is invalid/i)
    const passwordErrorElement = screen.queryByText(/the password you enreted should contain 5 or more character/i);
    const confirmPasswordErrorElementAgain = screen.queryByText(/the password don't match. try again/i);

    expect(emailErrorElement).not.toBeInTheDocument();
    expect(passwordErrorElement).not.toBeInTheDocument();
    expect(confirmPasswordErrorElementAgain).not.toBeInTheDocument();
})

