import React, { useEffect, useMemo, useState } from "react";
import {
  Camera,
  CheckCircle2,
  XCircle,
  Search,
  Store,
  User,
  Lock,
  Upload,
  ReceiptText,
  Trash2,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  University,
} from "lucide-react";

const LOCAL_PASSWORD = "1234";
const STORAGE_KEY = "restaurante_demo_orders";
const REVIEW_KEY = "restaurante_demo_review_orders";
const SURVEY_LINK =
  "https://docs.google.com/forms/d/e/1FAIpQLScZmsmyoTerVQ-vvwZsfqZzSj3m_GMKSGPSn0JM6h5mg9IQcQ/viewform";

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ChileLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white p-2 shadow-sm">
        <img
          src="/logo-uchile.jpg"
          alt="Logo Universidad de Chile"
          className="h-full w-full object-contain"
        />
      </div>

      <div>
        <p className="text-sm font-black uppercase tracking-wide text-white/70">
          Universidad de Chile
        </p>
        <p className="text-lg font-black leading-tight text-white">
          Ingeniería Civil Industrial
        </p>
        <p className="text-xs font-bold text-white/60">
          FCFM · Facultad de Ciencias Físicas y Matemáticas
        </p>
      </div>
    </div>
  );
}

function LoginCard({ title, subtitle, icon: Icon, onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();

    if (password === LOCAL_PASSWORD) {
      setError("");
      onLogin();
      return;
    }

    setError("Contraseña incorrecta.");
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-xl rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-200/50"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
          <Icon size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="text-sm text-neutral-500">{subtitle}</p>
        </div>
      </div>

      <label className="text-sm font-black text-neutral-700">Contraseña</label>

      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
        <Lock size={18} className="text-neutral-400" />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Ingresa la contraseña del restaurante"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          <AlertTriangle size={17} />
          {error}
        </div>
      )}

      <button className="mt-5 w-full rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.02]">
        Entrar
      </button>
    </form>
  );
}

function StatusBadge({ status }) {
  if (status === "ok") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700">
        <CheckCircle2 size={15} />
        Pedido OK
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-black text-red-700">
      <XCircle size={15} />
      Pedido NO OK
    </span>
  );
}

function LocalPanel({
  orders,
  setOrders,
  reviewOrders,
  setReviewOrders,
  onLogout,
}) {
  const [localTab, setLocalTab] = useState("nuevo");
  const [orderNumber, setOrderNumber] = useState("");
  const [photo, setPhoto] = useState("");
  const [status, setStatus] = useState("ok");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const generateOrderNumber = () => {
    const random = Math.floor(10000 + Math.random() * 90000);
    setOrderNumber(`ORD-${random}`);
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const clearForm = () => {
    setOrderNumber("");
    setPhoto("");
    setStatus("ok");
    setNote("");
  };

  const sendToReview = () => {
    if (!orderNumber.trim()) {
      setMessage("Falta ingresar el número de orden.");
      return;
    }

    if (!photo) {
      setMessage("Falta subir la foto del pedido.");
      return;
    }

    if (!note.trim()) {
      setMessage(
        "Si el pedido está NO OK, debes escribir una observación obligatoria."
      );
      return;
    }

    const reviewOrder = {
      orderNumber: orderNumber.trim(),
      photo,
      status: "no",
      note: note.trim(),
      createdAt: new Date().toLocaleString("es-CL"),
    };

    const withoutRepeated = reviewOrders.filter(
      (order) => order.orderNumber !== reviewOrder.orderNumber
    );

    const updatedReview = [reviewOrder, ...withoutRepeated];

    setReviewOrders(updatedReview);
    saveStorage(REVIEW_KEY, updatedReview);

    setMessage(`Orden ${reviewOrder.orderNumber} enviada a revisión interna.`);
    clearForm();
    setLocalTab("revision");
  };

  const publishOrder = () => {
    if (!orderNumber.trim()) {
      setMessage("Falta ingresar el número de orden.");
      return;
    }

    if (!photo) {
      setMessage("Falta subir la foto del pedido.");
      return;
    }

    if (status === "no") {
      sendToReview();
      return;
    }

    const newOrder = {
      orderNumber: orderNumber.trim(),
      photo,
      status: "ok",
      note: note.trim(),
      createdAt: new Date().toLocaleString("es-CL"),
    };

    const withoutRepeated = orders.filter(
      (order) => order.orderNumber !== newOrder.orderNumber
    );

    const updatedOrders = [newOrder, ...withoutRepeated];

    setOrders(updatedOrders);
    saveStorage(STORAGE_KEY, updatedOrders);

    setMessage(`Orden ${newOrder.orderNumber} publicada para el cliente.`);
    clearForm();
    setLocalTab("publicados");
  };

  const markCorrected = (reviewOrder) => {
    const updatedReview = reviewOrders.filter(
      (order) => order.orderNumber !== reviewOrder.orderNumber
    );

    setReviewOrders(updatedReview);
    saveStorage(REVIEW_KEY, updatedReview);

    setOrderNumber(reviewOrder.orderNumber);
    setPhoto(reviewOrder.photo);
    setStatus("ok");
    setNote(`Corregido desde revisión: ${reviewOrder.note}`);
    setMessage(
      "Pedido corregido. Ahora confirma OK y publícalo para que aparezca al cliente."
    );
    setLocalTab("nuevo");
  };

  const deletePublishedOrder = (orderNumberToDelete) => {
    const updatedOrders = orders.filter(
      (order) => order.orderNumber !== orderNumberToDelete
    );

    setOrders(updatedOrders);
    saveStorage(STORAGE_KEY, updatedOrders);
  };

  const deleteReviewOrder = (orderNumberToDelete) => {
    const updatedReview = reviewOrders.filter(
      (order) => order.orderNumber !== orderNumberToDelete
    );

    setReviewOrders(updatedReview);
    saveStorage(REVIEW_KEY, updatedReview);
  };

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-200/50">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white">
            <Store size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Restaurante</h2>
            <p className="text-sm text-neutral-500">
              Registro y validación visual antes de publicar al cliente.
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-black text-neutral-700 hover:bg-neutral-200"
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>

      <div className="mb-6 grid gap-2 rounded-[1.3rem] bg-neutral-100 p-1 sm:grid-cols-3">
        <button
          onClick={() => setLocalTab("nuevo")}
          className={`rounded-[1rem] px-4 py-3 text-sm font-black transition ${
            localTab === "nuevo"
              ? "bg-white text-neutral-950 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          Nuevo pedido
        </button>

        <button
          onClick={() => setLocalTab("revision")}
          className={`rounded-[1rem] px-4 py-3 text-sm font-black transition ${
            localTab === "revision"
              ? "bg-white text-neutral-950 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          Revisión interna ({reviewOrders.length})
        </button>

        <button
          onClick={() => setLocalTab("publicados")}
          className={`rounded-[1rem] px-4 py-3 text-sm font-black transition ${
            localTab === "publicados"
              ? "bg-white text-neutral-950 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          Publicados ({orders.length})
        </button>
      </div>

      {localTab === "nuevo" && (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.5rem] bg-neutral-50 p-5">
            <h3 className="mb-4 text-xl font-black">Ingresar pedido</h3>

            <label className="text-sm font-black text-neutral-700">
              Número de orden
            </label>

            <div className="mt-2 flex gap-2">
              <input
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="Ej: ORD-12345"
                className="h-12 flex-1 rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-neutral-500"
              />

              <button
                onClick={generateOrderNumber}
                className="rounded-2xl bg-neutral-950 px-4 text-sm font-black text-white"
              >
                Auto
              </button>
            </div>

            <div className="mt-5">
              <label className="text-sm font-black text-neutral-700">
                Foto del pedido
              </label>

              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-neutral-300 bg-white p-6 text-center transition hover:border-neutral-500">
                {photo ? (
                  <img
                    src={photo}
                    alt="Foto del pedido"
                    className="max-h-64 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <>
                    <Upload size={36} className="text-neutral-400" />
                    <p className="mt-3 font-black">Subir foto</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Foto tomada por el restaurante antes de entregar el pedido.
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-5">
              <p className="text-sm font-black text-neutral-700">
                ¿Está todo en el pedido?
              </p>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStatus("ok")}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    status === "ok"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                      : "bg-white text-neutral-700"
                  }`}
                >
                  OK
                </button>

                <button
                  onClick={() => setStatus("no")}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    status === "no"
                      ? "bg-red-600 text-white shadow-lg shadow-red-100"
                      : "bg-white text-neutral-700"
                  }`}
                >
                  NO OK
                </button>
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-black text-neutral-700">
                Observación{" "}
                {status === "no" && (
                  <span className="text-red-600">obligatoria</span>
                )}
              </label>

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={
                  status === "no"
                    ? "Ej: falta bebida, falta salsa, bolsa abierta, producto incorrecto..."
                    : "Ej: pedido completo, bolsa sellada, bebida incluida..."
                }
                className="mt-2 min-h-24 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
              />
            </div>

            {message && (
              <div className="mt-4 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-bold text-white">
                {message}
              </div>
            )}

            <button
              onClick={status === "no" ? sendToReview : publishOrder}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black text-white transition hover:scale-[1.02] ${
                status === "no" ? "bg-red-600" : "bg-emerald-600"
              }`}
            >
              {status === "no" ? (
                <>
                  <ArrowRight size={17} />
                  Siguiente: enviar a revisión
                </>
              ) : (
                <>
                  <Camera size={17} />
                  Publicar pedido OK
                </>
              )}
            </button>
          </div>

          <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h3 className="text-xl font-black">Flujo de control</h3>
                <p className="text-sm text-neutral-500">
                  El cliente solo verá pedidos publicados como OK.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="font-black">1. Restaurante toma foto</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Se registra evidencia visual con número de orden.
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="font-black">2. Validación</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Si está OK, se publica. Si NO OK, pasa a revisión interna.
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="font-black">3. Cliente consulta</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Con el número de orden, el cliente ve la foto y la
                  confirmación.
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-950 p-4 text-white">
                <p className="font-black">4. Cliente confirma recepción</p>
                <p className="mt-1 text-sm text-white/60">
                  Después de ver la foto, el cliente puede marcar que recibió el
                  pedido y responder la encuesta.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {localTab === "revision" && (
        <div>
          <h3 className="mb-4 text-xl font-black">
            Pedidos con observación interna
          </h3>

          {reviewOrders.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
              <ClipboardCheck size={38} className="mx-auto text-neutral-300" />
              <p className="mt-3 font-black">No hay pedidos en revisión</p>
              <p className="mt-1 text-sm text-neutral-500">
                Los pedidos marcados como NO OK aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {reviewOrders.map((order) => (
                <article
                  key={order.orderNumber}
                  className="rounded-[1.5rem] border border-red-100 bg-red-50 p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={order.photo}
                      alt={`Pedido ${order.orderNumber}`}
                      className="h-28 w-28 rounded-2xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-lg font-black">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs font-bold text-red-400">
                            {order.createdAt}
                          </p>
                        </div>

                        <StatusBadge status="no" />
                      </div>

                      <div className="mt-3 rounded-2xl bg-white p-3 text-sm text-red-800">
                        <p className="font-black">Observación:</p>
                        <p className="mt-1">{order.note}</p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => markCorrected(order)}
                          className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:scale-[1.02]"
                        >
                          <CheckCircle2 size={16} />
                          Marcar corregido
                        </button>

                        <button
                          onClick={() => deleteReviewOrder(order.orderNumber)}
                          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-red-700 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {localTab === "publicados" && (
        <div>
          <h3 className="mb-4 text-xl font-black">
            Pedidos publicados para cliente
          </h3>

          {orders.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
              <ReceiptText size={38} className="mx-auto text-neutral-300" />
              <p className="mt-3 font-black">Aún no hay pedidos publicados</p>
              <p className="mt-1 text-sm text-neutral-500">
                Solo aparecerán aquí los pedidos confirmados como OK.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {orders.map((order) => (
                <article
                  key={order.orderNumber}
                  className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <img
                      src={order.photo}
                      alt={`Pedido ${order.orderNumber}`}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-lg font-black">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs font-bold text-neutral-400">
                            {order.createdAt}
                          </p>
                        </div>

                        <StatusBadge status={order.status} />
                      </div>

                      {order.note && (
                        <p className="mt-2 rounded-2xl bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
                          {order.note}
                        </p>
                      )}

                      <button
                        onClick={() => deletePublishedOrder(order.orderNumber)}
                        className="mt-3 flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-2 text-xs font-black text-neutral-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ClientPanel({ orders }) {
  const [searchNumber, setSearchNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [received, setReceived] = useState(false);

  const foundOrder = useMemo(() => {
    return orders.find(
      (order) =>
        order.orderNumber.toLowerCase() === searchNumber.trim().toLowerCase()
    );
  }, [orders, searchNumber]);

  const handleSearchChange = (event) => {
    setSearchNumber(event.target.value);
    setSearched(false);
    setReceived(false);
  };

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-200/50">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
            <User size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Cliente</h2>
            <p className="text-sm text-neutral-500">
              Ingresa tu número de orden para revisar la evidencia del pedido.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-neutral-50 p-5">
        <label className="text-sm font-black text-neutral-700">
          Número de orden
        </label>

        <div className="mt-2 flex gap-2">
          <input
            value={searchNumber}
            onChange={handleSearchChange}
            placeholder="Ej: ORD-12345"
            className="h-12 flex-1 rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-neutral-500"
          />

          <button
            onClick={() => {
              setSearched(true);
              setReceived(false);
            }}
            className="flex items-center gap-2 rounded-2xl bg-neutral-950 px-5 text-sm font-black text-white"
          >
            <Search size={17} />
            Buscar
          </button>
        </div>
      </div>

      <div className="mt-6">
        {!searched ? (
          <div className="rounded-[1.5rem] border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
            <Search size={38} className="mx-auto text-neutral-300" />
            <p className="mt-3 font-black">Busca tu pedido</p>
            <p className="mt-1 text-sm text-neutral-500">
              El cliente puede ver la foto publicada por el restaurante usando
              su número de orden.
            </p>
          </div>
        ) : foundOrder ? (
          <article className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-sm">
            <img
              src={foundOrder.photo}
              alt={`Pedido ${foundOrder.orderNumber}`}
              className="max-h-[520px] w-full object-cover"
            />

            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-neutral-400">
                    Número de orden
                  </p>
                  <h3 className="text-3xl font-black">
                    {foundOrder.orderNumber}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    Subido por el restaurante el {foundOrder.createdAt}
                  </p>
                </div>

                <StatusBadge status="ok" />
              </div>

              <div className="mt-5 rounded-[1.5rem] bg-emerald-50 p-5 text-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={22} />
                  <p className="font-black">
                    El restaurante confirmó que el pedido está completo.
                  </p>
                </div>

                {foundOrder.note && (
                  <p className="mt-2 text-sm leading-6">{foundOrder.note}</p>
                )}
              </div>

              {!received ? (
                <div className="mt-5 rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-5">
                  <p className="font-black">Confirmación del cliente</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Si ya recibiste tu pedido y coincide con la foto mostrada,
                    confirma la recepción para continuar con la encuesta.
                  </p>

                  <button
                    onClick={() => setReceived(true)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.02]"
                  >
                    <CheckCircle2 size={17} />
                    Recibí mi pedido
                  </button>
                </div>
              ) : (
                <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={22} />
                    <p className="font-black">Pedido recibido correctamente</p>
                  </div>

                  <p className="mt-2 text-sm leading-6">
                    Gracias por confirmar la recepción. Ahora puedes responder
                    una breve encuesta sobre tu experiencia.
                  </p>

                  <a
                    href={SURVEY_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.02]"
                  >
                    Responder encuesta
                  </a>
                </div>
              )}
            </div>
          </article>
        ) : (
          <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <XCircle size={38} className="mx-auto" />
            <p className="mt-3 font-black">No encontramos esa orden</p>
            <p className="mt-1 text-sm">
              Revisa que el número esté escrito igual que en el restaurante. Si
              el pedido estaba en revisión interna, todavía no aparece al
              cliente.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [orders, setOrders] = useState([]);
  const [reviewOrders, setReviewOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("local");
  const [localLogged, setLocalLogged] = useState(false);

  useEffect(() => {
    setOrders(readStorage(STORAGE_KEY));
    setReviewOrders(readStorage(REVIEW_KEY));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-red-50 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                CheckOrder
              </h1>
              <p className="text-sm text-neutral-500">
                Verificación visual de pedidos · Prototipo universitario
              </p>
            </div>
          </div>

          <div className="rounded-full bg-neutral-100 p-1">
            <button
              onClick={() => setActiveTab("local")}
              className={`rounded-full px-5 py-2.5 text-sm font-black transition ${
                activeTab === "local"
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-600"
              }`}
            >
              Restaurante
            </button>

            <button
              onClick={() => setActiveTab("client")}
              className={`rounded-full px-5 py-2.5 text-sm font-black transition ${
                activeTab === "client"
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-600"
              }`}
            >
              Cliente
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-[2rem] bg-neutral-950 p-6 text-white shadow-2xl shadow-neutral-300">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <ChileLogo />

              <div className="mt-8">
                <p className="mb-3 w-fit rounded-full bg-red-600 px-4 py-2 text-sm font-black">
                  Demo funcional · trazabilidad de pedidos
                </p>

                <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-tight">
                  Validación visual del pedido antes de llegar al cliente.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
                  El restaurante sube una foto asociada al número de orden. Si
                  el pedido está incompleto, queda en revisión interna y no se
                  publica al cliente hasta ser corregido.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.5rem] bg-white/10 p-5">
                <University size={28} className="text-red-300" />
                <p className="mt-3 font-black">Contexto académico</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Proyecto desarrollado para simular control de calidad y
                  responsabilidad entre restaurante, delivery y cliente.
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-white/10 p-5">
                <ClipboardCheck size={28} className="text-emerald-300" />
                <p className="mt-3 font-black">Regla del prototipo</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Solo los pedidos confirmados como OK pueden ser consultados
                  desde el apartado del cliente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {activeTab === "local" ? (
          localLogged ? (
            <LocalPanel
              orders={orders}
              setOrders={setOrders}
              reviewOrders={reviewOrders}
              setReviewOrders={setReviewOrders}
              onLogout={() => setLocalLogged(false)}
            />
          ) : (
            <LoginCard
              title="Acceso Restaurante"
              subtitle="El restaurante registra fotos y valida pedidos."
              icon={Store}
              onLogin={() => setLocalLogged(true)}
            />
          )
        ) : (
          <ClientPanel orders={orders} />
        )}
      </main>
    </div>
  );
}