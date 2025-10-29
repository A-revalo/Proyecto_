import React, { useState } from "react";
import "../styles/styles.css"; // tu hoja de estilos


function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    registerEmail: "",
    documentType: "",
    documentNumber: "",
    populationType: "",
    localidad: "",
    password: "",
    confirmPassword: "",
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  // Actualizar inputStyle para mejorar visibilidad del texto
  const inputStyle = (field) => ({
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: fieldErrors[field] && touchedFields[field] ? '1.5px solid #dc3545' : '1.5px solid #ccc',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: '2px',
    backgroundColor: 'white',
    color: '#333', // Color de texto más oscuro
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const fieldErrors = errors;

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    if (name === "registerEmail" && formData.registerEmail && !validateEmail(formData.registerEmail)) {
      setErrors((prev) => ({ ...prev, registerEmail: "Por favor ingresa un correo electrónico válido" }));
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasLetter && hasNumber && hasSymbol;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (message) {
      setMessage("");
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateRequiredFields = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName", "lastName", "registerEmail", "documentType",
      "documentNumber", "populationType", "localidad", "password", "confirmPassword"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "Por favor rellena este campo";
      }
    });

    if (formData.registerEmail && !validateEmail(formData.registerEmail)) {
      newErrors.registerEmail = "Por favor ingresa un correo electrónico válido";
    }

    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres, incluir una letra, número y símbolo";
    }

    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (formData.documentNumber && formData.documentNumber.length < 6) {
      newErrors.documentNumber = "El número de documento debe tener al menos 6 dígitos";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc, [key]: true
    }), {});
    setTouchedFields(allTouched);

    const newErrors = validateRequiredFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("❌ Por favor completa todos los campos correctamente");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          registerEmail: formData.registerEmail.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessage("✅ Registro exitoso");
        setFormData({
          firstName: "",
          lastName: "",
          registerEmail: "",
          documentType: "",
          documentNumber: "",
          populationType: "",
          localidad: "",
          password: "",
          confirmPassword: "",
        });
        setErrors({});
        setTouchedFields({});
      } else {
        setMessage(`⚠️ Error: ${data.error || data.message || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      setMessage("⚠️ Error en el registro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '40px', maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', marginBottom: '8px', fontSize: '28px', fontWeight: '600' }}>Crear Cuenta</h1>
          <p style={{ color: '#34495e', fontSize: '16px' }}>Regístrate para comenzar</p>
        </div>

        {message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <div>
          {/* Nombre */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              color: '#2c3e50', // Color más oscuro para labels
              fontSize: '15px', 
              fontWeight: '500' 
            }}>
              Nombre *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle('firstName')}
            />
            {fieldErrors.firstName && touchedFields.firstName && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {fieldErrors.firstName}
              </span>
            )}
          </div>

          {/* Apellido */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              color: '#2c3e50', // Color más oscuro para labels
              fontSize: '15px', 
              fontWeight: '500' 
            }}>
              Apellido *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle('lastName')}
            />
            {fieldErrors.lastName && touchedFields.lastName && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {fieldErrors.lastName}
              </span>
            )}
          </div>

          {/* Correo */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              color: '#2c3e50', // Color más oscuro para labels
              fontSize: '15px', 
              fontWeight: '500' 
            }}>
              Correo electrónico *
            </label>
            <input
              type="email"
              name="registerEmail"
              value={formData.registerEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="ejemplo@correo.com"
              style={inputStyle('registerEmail')}
            />
            {fieldErrors.registerEmail && touchedFields.registerEmail && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {fieldErrors.registerEmail}
              </span>
            )}
          </div>

          {/* Tipo de documento */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#2c3e50', // Color más oscuro para labels
              fontSize: '15px', 
              fontWeight: '500' 
            }}>
              Tipo de documento *
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { value: "cc", label: "Cédula de ciudadanía" },
                { value: "ti", label: "Tarjeta de identidad" },
                { value: "ce", label: "Cédula de extranjería" },
                { value: "pp", label: "Pasaporte" }
              ].map((doc) => (
                <label key={doc.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="radio"
                    name="documentType"
                    value={doc.value}
                    checked={formData.documentType === doc.value}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  {doc.label}
                </label>
              ))}
            </div>
            {fieldErrors.documentType && touchedFields.documentType && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {fieldErrors.documentType}
              </span>
            )}
          </div>

          {/* Número de documento */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              color: '#2c3e50', // Color más oscuro para labels
              fontSize: '15px', 
              fontWeight: '500' 
            }}>
              Número de documento *
            </label>
            <input
              type="text"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle('documentNumber')}
            />
            {fieldErrors.documentNumber && touchedFields.documentNumber && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {fieldErrors.documentNumber}
              </span>
            )}
          </div>

          {/* Caracterización de población */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              color: '#2c3e50', // Color más oscuro para labels
              fontSize: '15px', 
              fontWeight: '500' 
            }}>
              Caracterización de población *
            </label>
            <select
              name="populationType"
              value={formData.populationType}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...inputStyle('populationType'),
                backgroundColor: 'white',
                color: formData.populationType ? '#333' : '#666', // Color más oscuro cuando hay selección
                appearance: 'none', // Quitar estilos nativos
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '30px'
              }}
            >
              <option value="" style={{ color: '#666' }}>Seleccione...</option>
              <option value="indigena">Indígena</option>
              <option value="afrodescendiente">Afrodescendiente</option>
              <option value="discapacidad">Persona con discapacidad</option>
              <option value="desplazado">Desplazado</option>
              <option value="ninguna">Ninguna</option>
            </select>
            {fieldErrors.populationType && touchedFields.populationType && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {fieldErrors.populationType}
              </span>
            )}
          </div>

          {/* Localidad */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              color: '#2c3e50', // Color más oscuro para labels
              fontSize: '15px', 
              fontWeight: '500' 
            }}>
              Localidad *
            </label>
            <select
              name="localidad"
              value={formData.localidad}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...inputStyle('localidad'),
                backgroundColor: 'white',
                color: formData.localidad ? '#333' : '#666', // Color más oscuro cuando hay selección
                appearance: 'none', // Quitar estilos nativos
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '30px'
              }}
            >
              <option value="" style={{ color: '#666' }}>Seleccione...</option>
              <option value="usaquen">Usaquén</option>
              <option value="chapinero">Chapinero</option>
              <option value="santa_fe">Santa Fe</option>
              <option value="san_cristobal">San Cristóbal</option>
              <option value="usme">Usme</option>
              <option value="tunjuelito">Tunjuelito</option>
              <option value="bosa">Bosa</option>
              <option value="kennedy">Kennedy</option>
              <option value="fontibon">Fontibón</option>
              <option value="engativa">Engativá</option>
              <option value="suba">Suba</option>
              <option value="barrios_unidos">Barrios Unidos</option>
              <option value="teusaquillo">Teusaquillo</option>
              <option value="los_martires">Los Mártires</option>
              <option value="antonio_narino">Antonio Nariño</option>
              <option value="puente_aranda">Puente Aranda</option>
              <option value="candelaria">La Candelaria</option>
              <option value="rafael_uribe">Rafael Uribe Uribe</option>
              <option value="ciudad_bolivar">Ciudad Bolívar</option>
            </select>
            {fieldErrors.localidad && touchedFields.localidad && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {fieldErrors.localidad}
              </span>
            )}
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              color: '#2c504bff', // Color más oscuro para labels
              fontSize: '15px', 
              fontWeight: '500' 
            }}>
              Contraseña *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{...inputStyle('password'), paddingRight: '40px'}}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '12px',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: '#2c3e50', // Color base del ícono
                  transition: 'color 0.3s ease', // Transición suave
                  opacity: 0.8, // Opacidad inicial
                  ':hover': {
                    opacity: 1,
                    color: '#34495e' // Color al pasar el mouse
                  }
                }}
                onMouseOver={(e) => e.target.style.color = '#34495e'}
                onMouseOut={(e) => e.target.style.color = '#2c3e50'}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  style={{
                    transition: 'transform 0.2s ease',
                    transform: showPassword ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  {showPassword ? (
                    <>
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.5"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
            <small style={{ color: '#1d0844ff', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              Mínimo 8 caracteres, incluir una letra, número y símbolo.
            </small>
            {fieldErrors.password && touchedFields.password && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Confirmar Contraseña */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              color: '#2c3e50', // Color más oscuro para labels
              fontSize: '15px', 
              fontWeight: '500' 
            }}>
              Confirmar contraseña *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle('confirmPassword')}
            />
            {fieldErrors.confirmPassword && touchedFields.confirmPassword && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {fieldErrors.confirmPassword}
              </span>
            )}
          </div>

          {/* Botón */}
          <button 
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#9ca3af' : '#2c3e50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => {
              if (!isLoading) e.target.style.backgroundColor = '#34495e';
            }}
            onMouseOut={(e) => {
              if (!isLoading) e.target.style.backgroundColor = '#2c3e50';
            }}
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>

          {/* Actualizar color del enlace */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a 
              href="/login" 
              style={{ 
                color: '#2c3e50', 
                textDecoration: 'none', 
                fontSize: '14px',
                fontWeight: '500',
                transition: 'color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.color = '#34495e'}
              onMouseOut={(e) => e.target.style.color = '#2c3e50'}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;