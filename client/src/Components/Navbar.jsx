import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../app/feature/authSlice.js'

const Navbar = () => {
    const {user} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        navigate('/')
        dispatch(logout())

    }

    return (
        <div className='shadow bg-white sticky top-0 z-50'>
            <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
                <Link to='/' className='text-xl font-bold text-slate-800 hover:text-slate-600 transition-colors'>
                <img src="/logo.svg" alt="" />
                </Link>
                <div className='flex items-center gap-4 text-sm'>
                    <p className='max-sm:hidden font-medium'>Hi, {user?.name}</p>
                    <button
                        onClick={handleLogout}
                        className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar