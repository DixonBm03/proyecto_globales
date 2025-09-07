export default function Footer(){
    return (
        <footer className="footer">
            <div className="container footer__wrap">
                <div className="footer__cols">
                    <div>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                            <span className="brand__dot" style={{background:"#fff"}} />
                            <strong>Climate App</strong>
                        </div>
                        <p style={{margin:0,opacity:.9}}>Datos útiles para entender el clima y actuar.</p>
                    </div>
                    <div>
                        <h4>Proyecto</h4>
                        <div><a href="#!">Acerca</a></div>
                        <div><a href="#!">Equipo</a></div>
                        <div><a href="#!">Contacto</a></div>
                    </div>
                    <div>
                        <h4>Recursos</h4>
                        <div><a href="#!">API pública</a></div>
                        <div><a href="#!">Guías</a></div>
                        <div><a href="#!">FAQ</a></div>
                    </div>
                    <div>
                        <h4>Legal</h4>
                        <div><a href="#!">Términos</a></div>
                        <div><a href="#!">Privacidad</a></div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <span>© 2025 Climate App</span>
                    <span>Creado con ❤️ para la <span className="kbd">GAM</span></span>
                </div>
            </div>
        </footer>
    );
}
