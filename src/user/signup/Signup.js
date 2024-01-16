import React, { Component } from 'react';
import './Signup.css';
import { Link, Redirect } from 'react-router-dom'
import { signup } from '../../service/OnlineService';
import fbLogo from '../../img/fb-logo.png';
import googleLogo from '../../img/google-logo.png';
import Alert from 'react-s-alert';

export const API_BASE_URL = 'http://localhost:8080';
export const OAUTH2_REDIRECT_URI = 'http://localhost:3000/oauth2/redirect';
export const GOOGLE_AUTH_URL = API_BASE_URL + '/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI;
export const FACEBOOK_AUTH_URL = API_BASE_URL + '/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI;


class Signup extends Component {
    render() {
        if(this.props.authenticated) {
            return <Redirect
                to={{
                pathname: "/",
                state: { from: this.props.location }
            }}/>;            
        }

        return (
            <div className="signup-container">
                <div className="signup-content">
                    <h1 className="signup-title">Signup</h1>
                    <SocialSignup />
                    {/* OR Seperator between Social SignUp and Local SignUp Form */}
                    <div className="or-separator">
                        <span className="or-text">OR</span>
                    </div>
                    <SignupForm {...this.props} />
                    <span className="login-link">Already have an account? <Link to="/login">Login!</Link></span>
                </div>
            </div>
        );
    }
}

//Social SignUp form 
class SocialSignup extends Component {
    render() {
        return (
            <div className="social-signup">
                <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                    <img src={googleLogo} alt="Google" /> Sign up with Google</a>
            </div>
        );
    }
}

//Local SignUp Form
class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            email: '',
            password: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : inputValue
        });        
    }

    handleSubmit(event) {
        event.preventDefault(); 
        
        const { userName, email, password } = this.state;

        let errorMessage = '';

        // Validate username, email, and password length
        switch (true) {
            case userName.length < 8 || userName.length > 20:
                errorMessage = "Username should be between 8 and 20 characters.";
                break;
            case email.length < 12 || email.length > 30:
                errorMessage = "Email should not be less than 12 characters and should be at most 30 characters.";
                break;
            case password.length < 4 || password.length > 8:
                errorMessage = "Password should be between 4 and 8 characters.";
                break;
            default:
                break;
        }

        if (errorMessage) {
            Alert.error(errorMessage);
            return;
        }

        const signUpRequest = Object.assign({}, this.state);

        signup(signUpRequest)
        .then(response => {
            Alert.success("You're successfully registered. Please login to continue!");
            this.props.history.push("/login");
        }).catch(error => {
            Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');            
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-item">
                    <input type="text" name="userName" 
                        className="form-control" placeholder="Name"
                        value={this.state.userName} onChange={this.handleInputChange} required/>
                </div>
                <div className="form-item">
                    <input type="email" name="email" 
                        className="form-control" placeholder="Email"
                        value={this.state.email} onChange={this.handleInputChange} required/>
                </div>
                <div className="form-item">
                    <input type="password" name="password" 
                        className="form-control" placeholder="Password"
                        value={this.state.password} onChange={this.handleInputChange} required/>
                </div>
                <div className="form-item">
                    <button type="submit" className="btn btn-block btn-primary" >Sign Up</button>
                </div>
            </form>                    

        );
    }
}

export default Signup