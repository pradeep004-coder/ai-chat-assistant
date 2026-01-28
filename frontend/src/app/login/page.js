'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useContext } from 'react';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { ChatContext } from '@/context/Context';
import { Backend_API } from '@/constants/env';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();
    const router = useRouter();

    const context = useContext(ChatContext);

    const handleSubmit = async (e) => {
        const emailRegex = /[a-zA-Z0-9+-_.%]+@[^\s@]+\.[a-z]{2,}$/;
        e.preventDefault()
        const emailVal = emailRef.current.value.trim();
        const passwordVal = passwordRef.current.value.trim();

        if (!emailVal) return toast.warning("Enter email!!")
        if (!emailRegex.test(emailVal)) return toast.warning("Invalid email!!")
        if (emailVal.includes(" ")) return toast.warning("Email should not contain whitespaces!!")
        if (!passwordVal) return toast.warning("Enter password!!")
        if (passwordVal.includes(" ")) return toast.warning("Password should not contain whitespaces!!")
        if (passwordVal.length < 6) return toast.warning("Password length must be atleast 6 characters long!!")

        if (!loading) {
            setLoading(true);
            try {
                const res = await fetch(`${Backend_API}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: emailVal,
                        password: passwordVal
                    })
                });

                if (res.status === 404) {
                    toast.warning("Email is not registered!!");
                    return;
                }

                if (res.status === 401) {
                    toast.warning("Incorrect password!!");
                    return;
                }

                if (!res.ok) {
                    toast.error("Something went wrong!!");
                    return;
                }

                const data = await res.json();

                if (data?.token) {
                    localStorage.setItem("token", data.token);
                    context.setIsLoggedIn(true);

                    emailRef.current.value = "";
                    passwordRef.current.value = "";

                    toast.success("Login successful!");
                    setTimeout(() => router.push("/"), 500);
                }

            } catch (error) {
                console.error("Failed to login:", error);
                toast.error("Login failed!!");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <>
            <div className='h-screen w-full bg-zinc-200 fixed text-black'>
                <form className='p-2 w-[80%] md:w-[400px] mx-auto mt-[10%]' onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-3">
                        <label htmlFor='email'>Email address*:</label>
                        <input ref={emailRef} className='border-1 p-1 px-2 rounded-md' placeholder=" enter email ..." id="email" />
                    </div>
                    <div className="flex flex-col">
                        <label className='form-label'>Password*:</label>
                        <input ref={passwordRef} className='border-1 p-1 px-2 rounded-md' placeholder=" enter password ..." type="password" name="password" />
                    </div>
                    <div className='flex flex-col justify-center mt-5'>
                        <button type='submit' className={`px-2 py-1 text-zinc-100 font-bold rounded-lg ${loading ? "bg-zinc-400" : "bg-zinc-600 hover:bg-zinc-500"}`} disabled={loading}>
                            {loading ? <ClipLoader
                                color="grey"
                                loading={loading}
                                size={16}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                                : "Login"}
                        </button>
                        <small className='text-center'>Don't have an account?<Link href="/signup" className='text-blue-800'>Create Account</Link></small>
                    </div>
                </form>
            </div>
        </>
    )
}