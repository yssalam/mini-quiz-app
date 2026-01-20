import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyEmail } = useAuth();

    const [status, setStatus] = useState('verifying'); 
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Verification token is missing');
            return;
        }

        const verify = async () => {
            try {
                const response = await verifyEmail(token);
                setStatus('success');
                setMessage(response.message || 'Email verified successfully!');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };

        verify();
    }, [searchParams, verifyEmail, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <Card>
                    <div className="text-center">
                        {status === 'verifying' && (
                            <>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                                    <svg
                                        className="animate-spin h-6 w-6 text-blue-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Verifying your email
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Please wait while we verify your email address...
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                    <svg
                                        className="h-6 w-6 text-green-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Email verified!
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    {message}
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Redirecting to login page...
                                </p>
                                <Link to="/login">
                                    <Button variant="primary" fullWidth>
                                        Go to Login
                                    </Button>
                                </Link>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                    <svg
                                        className="h-6 w-6 text-red-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Verification failed
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    {message}
                                </p>
                                <div className="space-y-3">
                                    <Link to="/login">
                                        <Button variant="primary" fullWidth>
                                            Go to Login
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="outline" fullWidth>
                                            Create New Account
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </Card>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Need help?{' '}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        Contact support
                    </a>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;