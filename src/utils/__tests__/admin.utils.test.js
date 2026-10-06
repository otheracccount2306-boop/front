import {
  SUBJECT_DAYS,
  emptyToNull,
  formatDays,
  getAdminErrorMessage,
  getSubjectConflictMessage,
  isTodayOrFuture,
  isValidHttpUrl,
  isValidTimeInput,
  joinDateTime,
  matchesPlanName,
  splitDateTime,
} from "../admin.utils";

const httpError = (status, message) => ({
  isAxiosError: true,
  response: { status, data: { success: false, message } },
});

describe("errores del panel", () => {
  test("403 y 404 usan los mensajes acordados", () => {
    expect(getAdminErrorMessage(httpError(403, "x"))).toBe(
      "No tienes permisos para esta acción",
    );
    expect(getAdminErrorMessage(httpError(404, "x"))).toBe(
      "El registro no existe o ya fue eliminado",
    );
  });

  test("los mensajes por código de cada pantalla tienen prioridad", () => {
    expect(
      getAdminErrorMessage(httpError(409, "x"), {
        409: "El código ya existe, usa uno diferente",
      }),
    ).toBe("El código ya existe, usa uno diferente");
  });

  test("el 409 de asignaturas distingue conflicto de aula de código repetido", () => {
    expect(
      getSubjectConflictMessage(
        httpError(409, "El aula A-101 ya está ocupada en ese horario"),
      ),
    ).toBe("Ya existe una clase en esa aula en ese horario");
    expect(
      getSubjectConflictMessage(
        httpError(409, "Ya existe una asignatura con el código MAT101"),
      ),
    ).toBe("El código ya existe, usa uno diferente");
    expect(getSubjectConflictMessage(httpError(500, "x"))).toBeNull();
    expect(getSubjectConflictMessage(null)).toBeNull();
  });
});

describe("validaciones del panel", () => {
  test("hora en formato de 24 horas", () => {
    expect(isValidTimeInput("08:00")).toBe(true);
    expect(isValidTimeInput("23:59")).toBe(true);
    expect(isValidTimeInput("24:00")).toBe(false);
    expect(isValidTimeInput("8:00")).toBe(false);
    expect(isValidTimeInput("08:60")).toBe(false);
    expect(isValidTimeInput("")).toBe(false);
  });

  test("URL http o https", () => {
    expect(isValidHttpUrl("https://ucc.edu.co/img.png")).toBe(true);
    expect(isValidHttpUrl("http://x.co")).toBe(true);
    expect(isValidHttpUrl("ftp://x.co")).toBe(false);
    expect(isValidHttpUrl("https://")).toBe(false);
    expect(isValidHttpUrl("sin esquema")).toBe(false);
  });

  test("un evento nuevo debe ser hoy o futuro", () => {
    const now = new Date(2026, 8, 20, 15, 0);
    expect(isTodayOrFuture("2026-09-20", now)).toBe(true);
    expect(isTodayOrFuture("2026-09-21", now)).toBe(true);
    expect(isTodayOrFuture("2026-09-19", now)).toBe(false);
  });
});

describe("conversiones del formulario", () => {
  test("separa y une fecha y hora sin desfase", () => {
    expect(splitDateTime("2026-09-25T17:35:00")).toEqual({
      date: "2026-09-25",
      time: "17:35",
    });
    expect(splitDateTime(null)).toEqual({ date: "", time: "" });
    expect(joinDateTime("2026-09-25", "17:35")).toBe("2026-09-25T17:35:00");
  });

  test("texto vacío pasa a null", () => {
    expect(emptyToNull("  ")).toBeNull();
    expect(emptyToNull(" hola ")).toBe("hola");
    expect(emptyToNull(undefined)).toBeNull();
  });

  test("formatDays respeta el orden de la semana", () => {
    expect(formatDays(["MIERCOLES", "LUNES"])).toBe("Lun, Mié");
    expect(formatDays([])).toBe("");
    expect(SUBJECT_DAYS.map((day) => day.value)).toEqual([
      "LUNES",
      "MARTES",
      "MIERCOLES",
      "JUEVES",
      "VIERNES",
      "SABADO",
    ]);
  });
});

describe("matchesPlanName", () => {
  test("exige el nombre del plano, sin importar mayúsculas ni espacios en los extremos", () => {
    expect(
      matchesPlanName("  campus ucc santa marta ", "Campus UCC Santa Marta"),
    ).toBe(true);
    expect(matchesPlanName("Campus UCC", "Campus UCC Santa Marta")).toBe(false);
    expect(matchesPlanName("", "Campus")).toBe(false);
  });
});
