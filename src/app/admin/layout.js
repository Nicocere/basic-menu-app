import style from './AdminHome.module.css';


export default function RootLayout({ children }) {
    return (

        <main className={style.mainAdmin} >
            {children}
        </main>

    );
}
