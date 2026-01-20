import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../library/firebase";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            const user = {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL,
            };

            const token = await result.user.getIdToken();

            login(user, token);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
        }
    };
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [rememberMe, setRememberMe] = useState(
        localStorage.getItem("remember_me") === "true"
    );

    useEffect(() => {
        localStorage.setItem("remember_me", rememberMe);
    }, [rememberMe]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        try {
            await login({
                ...formData,
                rememberMe,
            });

            navigate('/dashboard');
        } catch (error) {
            const message =
                error.response?.data?.message || 'Invalid email or password';
            setServerError(message);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Selamat datang</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Belum punya akun?{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 no-underline">
                            Daftar disini
                        </Link>
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {serverError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                {serverError}
                            </div>
                        )}

                        <div>
                            <div className="flex flex-col items-start justify-between mb-1">

                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-star justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                
                            </div>
                            <div className="relative">

                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-1 flex items-center text-gray-400 rounded-none bg-transparent border-0"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>

                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                style={{
                                    accentColor: '#2563eb',
                                }}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Mulai sekarang...' : 'Login'}
                        </Button>
                    </form>

                    {/* <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className=" items-center mt-6 flex justify-center">
                            <Button
                                variant="secondary"
                                fullWidth disabled={isLoading}
                                onClick={handleGoogleLogin}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.23 9.21 3.24l6.85-6.85C35.82 2.04 30.28 0 24 0 14.64 0 6.61 5.38 2.69 13.22l8.01 6.22C12.65 13.09 17.91 9.5 24 9.5z" />
                                    <path fill="#4285F4" d="M46.5 24c0-1.57-.14-3.09-.41-4.57H24v9.14h12.7c-.55 2.96-2.18 5.47-4.64 7.18l7.09 5.51C43.91 37.3 46.5 31.1 46.5 24z" />
                                    <path fill="#FBBC05" d="M10.7 28.44A14.5 14.5 0 0 1 9.5 24c0-1.54.27-3.02.75-4.44l-8.01-6.22A23.98 23.98 0 0 0 0 24c0 3.91.94 7.6 2.59 10.86l8.11-6.42z" />
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.14 15.9-5.8l-7.09-5.51c-1.97 1.32-4.49 2.09-8.81 2.09-6.09 0-11.35-3.59-13.3-8.72l-8.11 6.42C6.58 42.62 14.64 48 24 48z" />
                                </svg>

                                Google
                            </Button>

                        </div>
                    </div> */}
                </Card>
            </div>
        </div>
    );
};

export default Login;