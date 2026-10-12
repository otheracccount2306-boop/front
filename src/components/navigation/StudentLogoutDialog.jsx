import React from 'react';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * @description Confirmación del cierre de sesión del estudiante. Al confirmar se borra la copia local
 *              de sus datos (horario, noticias, mapa) para que nadie más la vea en este dispositivo.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.logout - Estado devuelto por useLogoutConfirm
 * @returns {React.JSX.Element} Diálogo de confirmación
 */
const StudentLogoutDialog = ({ logout }) => (
  <ConfirmDialog
    visible={logout.visible}
    title="Cerrar sesión"
    message="¿Seguro que quieres cerrar tu sesión? Se borrará la copia de tus datos guardada en este dispositivo."
    confirmLabel="Cerrar sesión"
    loading={logout.loading}
    onCancel={logout.close}
    onConfirm={logout.confirm}
  />
);

export default StudentLogoutDialog;
