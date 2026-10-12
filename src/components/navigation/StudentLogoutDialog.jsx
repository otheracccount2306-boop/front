import React from 'react';
import ConfirmDialog from '../common/ConfirmDialog';

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
