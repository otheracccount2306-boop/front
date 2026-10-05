import MockAdapter from 'axios-mock-adapter';
import apiClient from '../client';
import {
  createNews,
  createService,
  createSubject,
  deleteEvent,
  deleteService,
  listAllEvents,
  listAllNews,
  listAllServices,
  listAllSpaces,
  listSubjects,
  listUsers,
  updateEvent,
  updateService,
  updateSpace,
  updateUserRole,
} from '../admin.api';

describe('admin.api', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  test('los listados envían solo los parámetros con valor', async () => {
    mock.onGet('/admin/news').reply(200, { data: { content: [] } });

    await listAllNews({ status: 'BORRADOR', category: '', page: 2 });

    expect(mock.history.get[0].params).toEqual({ status: 'BORRADOR', page: 2 });
  });

  test('los eventos administrativos consultan /admin/events con estado y página', async () => {
    mock.onGet('/admin/events').reply(200, { data: { content: [] } });

    await listAllEvents({ status: 'CANCELADO' });

    expect(mock.history.get[0].params).toEqual({ status: 'CANCELADO', page: 1 });
  });

  test('el tipo department del panel se traduce a departments del backend', async () => {
    mock.onGet('/admin/services/departments').reply(200, { data: [] });
    mock.onPost('/admin/services/departments').reply(201, { data: { id: '1' } });
    mock.onPut('/admin/services/departments/9').reply(200, { data: { id: '9' } });
    mock.onDelete('/admin/services/departments/9').reply(200, { data: null });

    await listAllServices('department');
    await createService('department', { nombre: 'Tesorería' });
    await updateService('department', '9', { nombre: 'Tesorería' });
    await deleteService('department', '9');

    expect(mock.history.get[0].url).toBe('/admin/services/departments');
    expect(mock.history.post[0].url).toBe('/admin/services/departments');
    expect(mock.history.put[0].url).toBe('/admin/services/departments/9');
    expect(mock.history.delete[0].url).toBe('/admin/services/departments/9');
  });

  test('wellbeing y faq conservan su ruta', async () => {
    mock.onGet('/admin/services/wellbeing').reply(200, { data: [] });
    mock.onGet('/admin/services/faq').reply(200, { data: [] });

    await listAllServices('wellbeing');
    await listAllServices('faq');

    expect(mock.history.get.map((request) => request.url)).toEqual(['/admin/services/wellbeing', '/admin/services/faq']);
  });

  test('las respuestas se desenvuelven: se devuelve solo data', async () => {
    mock.onGet('/admin/campus/spaces').reply(200, { success: true, data: [{ id: 'a' }], message: 'ok' });

    expect(await listAllSpaces()).toEqual([{ id: 'a' }]);
  });

  test('las asignaturas se filtran por periodo en el backend', async () => {
    mock.onGet('/admin/academic/subjects').reply(200, { data: [] });

    await listSubjects({ period: '2026-1' });

    expect(mock.history.get[0].params).toEqual({ period: '2026-1' });
  });

  test('crear y actualizar envían el cuerpo tal cual', async () => {
    mock.onPost('/admin/news').reply(201, { data: { id: 'n' } });
    mock.onPost('/admin/academic/subjects').reply(201, { data: { id: 's' } });
    mock.onPut('/admin/campus/spaces/7').reply(200, { data: { id: '7' } });
    mock.onPut('/admin/events/5').reply(200, { data: { id: '5' } });
    mock.onDelete('/admin/events/5').reply(200, { data: null });

    await createNews({ titulo: 'T', estado: 'BORRADOR' });
    await createSubject({ codigo: 'MAT101', dias: ['LUNES', 'MIERCOLES'] });
    await updateSpace('7', { activo: false });
    await updateEvent('5', { estado: 'CANCELADO' });
    await deleteEvent('5');

    expect(JSON.parse(mock.history.post[0].data)).toEqual({ titulo: 'T', estado: 'BORRADOR' });
    expect(JSON.parse(mock.history.post[1].data).dias).toEqual(['LUNES', 'MIERCOLES']);
    expect(JSON.parse(mock.history.put[0].data)).toEqual({ activo: false });
    expect(mock.history.delete).toHaveLength(1);
  });

  test('usuarios: filtro por activos y cambio de rol', async () => {
    mock.onGet('/admin/users').reply(200, { data: { totalElements: 3 } });
    mock.onPut('/admin/users/1/role').reply(200, { data: { id: '1' } });

    const page = await listUsers({ active: true, search: 'ana', page: 1 });
    await updateUserRole('1', 'ADMINISTRADOR');

    expect(page.totalElements).toBe(3);
    expect(mock.history.get[0].params).toEqual({ page: 1, search: 'ana', active: true });
    expect(JSON.parse(mock.history.put[0].data)).toEqual({ rol: 'ADMINISTRADOR' });
  });
});
