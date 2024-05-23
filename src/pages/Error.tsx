import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Error = () => {

    const location = useLocation()
    const pathName = location.pathname

    return (
        <section className="flex justify-center items-center bg-white dark:bg-gray-900 h-screen">
            <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="dark:text-primary-500 mb-6 text-5xl font-extrabold tracking-tight text-red-500 lg:text-8xl">Error 404! :(</h1>
                    <p className="mb-4 text-2xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">The requested URL {pathName} was not found on this server.</p>
                    <p className="mb-5 text-xl font-light text-gray-500 dark:text-gray-400">Sorry something went wrong.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center text-xl justify-center rounded-full bg-meta-3 py-3 px-8 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                       Back to site
                    </Link>
                </div>
            </div>
        </section>
    )
}
