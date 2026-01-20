import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useProfile } from "../../hooks/useProfile";
import { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const Profile = () => {
    const navigate = useNavigate();
    const { profile, loading, error, updateProfile, changePassword } = useProfile()
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: ''
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // State untuk toggle tampilan password section
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const [showPassword, setShowPassword] = useState({
        currentShowPassword: false,
        newShowPassword: false,
        confirmShowPassword: false
    });

    // State untuk loading saat submit form
    const [isSaving, setIsSaving] = useState(false);

    // State untuk success/error messages
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (profile) {
            setProfileForm({
                name: profile.name || '',
                email: profile.email || ''
            })
        }
    }, [profile])



    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleSaveChanges = async () => {
        try {
            setIsSaving(true)
            setMessage({
                type: '', text: ''
            })
            if (!profileForm.name.trim()) {
                setMessage({
                    type: 'error',
                    text: 'Nama tidak boleh kosong'
                })
                return
            }

            const result = await updateProfile({
                name: profileForm.name,
                email: profileForm.email
            });

            setMessage({
                type: 'success',
                text: result.message || 'Profile berhasil diupdate'
            });

            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Gagal update profile'
            });
        } finally {
            setIsSaving(false);
        }
    }


    const handleChangePassword = async () => {
        try {
            setIsSaving(true);
            setMessage({ type: '', text: '' });

            if (
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
            ) {
                setMessage({
                    type: 'error',
                    text: 'Semua field password harus diisi'
                });
                return;
            }

            if (passwordData.newPassword.length < 8) {
                setMessage({
                    type: 'error',
                    text: 'Password baru minimal 8 karakter'
                });
                return;
            }

            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setMessage({
                    type: 'error',
                    text: 'Konfirmasi password tidak sesuai'
                });
                return;
            }

            // ⬇️ VALIDASI PASSWORD LAMA TERJADI DI SINI (API)
            const result = await changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );

            setMessage({
                type: 'success',
                text: result.message || 'Password berhasil diubah'
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Password lama salah'
            });
        } finally {
            setIsSaving(false);
        }
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00008B] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">
                        {error || 'Gagal memuat profile. Silakan login kembali.'}
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-[#00008B] hover:bg-[#4169E1] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Login Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-x-hidden bg-gray-50">
            <Navbar onSearch={handleSearch} />

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">

                    {/* Success/Error Message */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Quiz History</h1>
                        <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </button>
                    </div>

                    {/* Header with Avatar */}
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                        <div>
                            <h2 className="font-medium text-gray-900">{profile.name}</h2>
                            <p className="text-sm text-gray-500">{profile.email}</p>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <div className="mt-6 space-y-6">

                        {/* Name Field */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <label className="text-gray-900 md:w-40 font-medium">Nama</label>
                            <input
                                type="text"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                className="flex-1 bg-gray-50 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#00008B] text-gray-600 transition-all"
                                placeholder="your name"
                            />
                        </div>

                        {/* Email Field (Read-only) */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <label className="text-gray-900 md:w-40 font-medium">Email akun</label>
                            <div className="flex-1 bg-gray-100 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed">
                                {profile.email}
                            </div>
                        </div>

                        {/* Save Change Button */}
                        <div className="pt-2">
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="bg-[#00008B] hover:bg-[#4169E1] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Simpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                            className="bg-[#00008B] hover:bg-[#4169E1] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {showPasswordSection ? 'Sembunyikan Ganti Password' : 'Ganti Password'}
                        </button>

                        {showPasswordSection && (
                            <div className="space-y-6 mt-4">

                                {/* Current Password */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <label className="text-gray-900 md:w-40 font-medium">Password Lama</label>
                                    <div className="relative flex flex-1 w-full">
                                        <input
                                            type={showPassword.currentShowPassword ? 'text' : 'password'}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            className=" flex-1 bg-gray-50 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#00008B] text-gray-600 transition-all"
                                            placeholder="Masukkan password lama"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, currentShowPassword: !prev.currentShowPassword }))}
                                            className="absolute inset-y-0 right-1 flex items-center text-gray-400 rounded-none bg-transparent border-0"
                                        >
                                            {showPassword.currentShowPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>

                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <label className="text-gray-900 md:w-40 font-medium">Password Baru</label>
                                    <div className="relative flex flex-1 w-full">
                                        <input
                                            type={showPassword.newShowPassword ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="flex-1 bg-gray-50 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#00008B] text-gray-600 transition-all"
                                            placeholder="Masukkan password baru"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, newShowPassword: !prev.newShowPassword }))}
                                            className="absolute inset-y-0 right-1 flex items-center text-gray-400 rounded-none bg-transparent border-0"
                                        >
                                            {showPassword.newShowPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <label className="text-gray-900 md:w-40 font-medium">Konfirmasi Password</label>
                                    <div className="relative flex flex-1 w-full">
                                        <input
                                            type={showPassword.confirmShowPassword ? 'text' : 'password'}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="flex-1 bg-gray-50 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#00008B] text-gray-600 transition-all"
                                            placeholder="Konfirmasi password baru"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, confirmShowPassword: !prev.confirmShowPassword }))}
                                            className="absolute inset-y-0 right-1 flex items-center text-gray-400 rounded-none bg-transparent border-0"
                                        >
                                            {showPassword.confirmShowPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Change Password Button */}
                                <div className="pt-2">
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={isSaving}
                                        className="bg-[#00008B] hover:bg-[#4169E1] text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Mengubah...' : 'Ubah Password'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;