import React, { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  ShoppingBag,
  Star,
  Clock,
  Bike,
  SlidersHorizontal,
  Heart,
  Plus,
  ChevronRight,
  Camera,
  CheckCircle2,
  Store,
  Home,
  ReceiptText,
  Phone,
  ShieldCheck,
  Upload,
  Play,
  Flag,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "Todos",
  "Promos",
  "Hamburguesas",
  "Pizza",
  "Sushi",
  "Pollo",
  "Postres",
  "Vegano",
  "Bebidas",
];

const restaurants = [
  {
    id: 1,
    name: "Burger Barrio",
    category: "Hamburguesas",
    rating: 4.8,
    time: "20-30 min",
    fee: "$990",
    promo: "2x1 seleccionado",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    tags: ["Burger", "Papas", "Popular"],
  },
  {
    id: 2,
    name: "Sushi Club",
    category: "Sushi",
    rating: 4.7,
    time: "25-35 min",
    fee: "$1.290",
    promo: "Envío gratis",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    tags: ["Rolls", "Tempura", "Fresco"],
  },
  {
    id: 3,
    name: "Pizza Nova",
    category: "Pizza",
    rating: 4.6,
    time: "18-28 min",
    fee: "$890",
    promo: "-30% hoy",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1200&auto=format&fit=crop",
    tags: ["Napolitana", "Familiar", "Queso"],
  },
  {
    id: 4,
    name: "Crunchy Chicken",
    category: "Pollo",
    rating: 4.5,
    time: "15-25 min",
    fee: "$1.090",
    promo: "Combo desde $4.990",
    image: "https://images.unsplash.com/photo-1562967916-eb82221dfb36?q=80&w=1200&auto=format&fit=crop",
    tags: ["Pollo", "Crispy", "Rápido"],
  },
  {
    id: 5,
    name: "Sweet Spot",
    category: "Postres",
    rating: 4.9,
    time: "20-30 min",
    fee: "$790",
    promo: "Compra 1 y lleva 2",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200&auto=format&fit=crop",
    tags: ["Helados", "Cakes", "Dulce"],
  },
  {
    id: 6,
    name: "Green Bowl",
    category: "Vegano",
    rating: 4.7,
    time: "22-32 min",
    fee: "$990",
    promo: "Healthy deal",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    tags: ["Ensaladas", "Bowls", "Vegano"],
  },
];

const burgerMenu = [
  {
    id: "classic",
    title: "Burger Clásica",
    description: "Carne, queso cheddar, lechuga, tomate y salsa especial.",
    price: 5990,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "double",
    title: "Doble Smash",
    description: "Doble carne, doble queso, pepinillos y cebolla caramelizada.",
    price: 7490,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "combo",
    title: "Combo Burger + Papas",
    description: "Hamburguesa clásica, papas medianas y bebida lata.",
    price: 8990,
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=900&auto=format&fit=crop",
  },
];

const featuredItems = [
  {
    title: "Combo burger + papas",
    price: "$6.990",
    restaurant: "Burger Barrio",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "Pizza pepperoni familiar",
    price: "$9.990",
    restaurant: "Pizza Nova",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=900&auto=format&fit=crop",
  },
  {
    title: "30 piezas premium",
    price: "$12.990",
    restaurant: "Sushi Club",
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=900&auto=format&fit=crop",
  },
];

const formatPrice = (value) => `$${value.toLocaleString("es-CL")}`;

const stageCopy = {
  browsing: {
    title: "Sin pedido activo",
    description: "Elige una hamburguesa y confirma el pedido para iniciar la simulación.",
  },
  created: {
    title: "Pedido creado",
    description: "El local recibió la orden y está preparando el pedido.",
  },
  courierCalled: {
    title: "Repartidor llamado",
    description: "Antes de retirar, el repartidor debe tomar una foto del pedido en el local.",
  },
  localPhotoDone: {
    title: "Foto del local registrada",
    description: "La app ya dejó evidencia visual de que el local entregó el pedido completo.",
  },
  onTheWay: {
    title: "Pedido en camino",
    description: "El repartidor está llevando el pedido al cliente.",
  },
  clientPhotoRequired: {
    title: "Entrega pendiente de comprobación",
    description: "Al llegar, se solicita una foto final para confirmar la entrega al cliente.",
  },
  completed: {
    title: "Pedido terminado",
    description: "El pedido quedó cerrado con fotos de retiro y entrega.",
  },
};

function PhotoUploader({ title, description, icon: Icon, photo, onUpload, disabled }) {
  return (
    <div className={`rounded-[1.5rem] border p-4 ${photo ? "border-emerald-200 bg-emerald-50" : "border-neutral-200 bg-white"}`}>
      <div className="flex gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${photo ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-800"}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black">{title}</p>
          <p className="mt-1 text-sm leading-5 text-neutral-500">{description}</p>
          {photo ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
              <img src={photo} alt={title} className="h-36 w-full object-cover" />
              <div className="flex items-center gap-2 p-3 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={17} /> Foto registrada correctamente
              </div>
            </div>
          ) : (
            <label className={`mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black transition ${disabled ? "pointer-events-none bg-neutral-100 text-neutral-400" : "bg-neutral-950 text-white hover:scale-[1.02]"}`}>
              <Upload size={17} /> Subir foto de prueba
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={disabled}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  onUpload(URL.createObjectURL(file));
                }}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderTracker({ stage, localPhoto, clientPhoto }) {
  const steps = [
    { key: "created", label: "Pedido", icon: ReceiptText },
    { key: "courierCalled", label: "Repartidor", icon: Bike },
    { key: "localPhotoDone", label: "Foto local", icon: Store },
    { key: "onTheWay", label: "En camino", icon: MapPin },
    { key: "completed", label: "Entregado", icon: Home },
  ];
  const order = ["browsing", "created", "courierCalled", "localPhotoDone", "onTheWay", "clientPhotoRequired", "completed"];
  const currentIndex = order.indexOf(stage);

  return (
    <div className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-white">
          <ShieldCheck size={22} />
        </div>
        <div>
          <h3 className="text-xl font-black">Control de trazabilidad</h3>
          <p className="text-sm leading-5 text-neutral-500">Simulación para demostrar en qué momento se pide evidencia fotográfica.</p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const stepIndex = order.indexOf(step.key);
          const done = currentIndex >= stepIndex || (step.key === "completed" && stage === "completed");
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full ${done ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-400"}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-black ${done ? "text-neutral-950" : "text-neutral-400"}`}>{step.label}</p>
                  {done && <CheckCircle2 size={16} className="text-emerald-600" />}
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-neutral-100">
                  <div className={`h-full rounded-full bg-neutral-950 transition-all ${done ? "w-full" : "w-0"}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-3xl bg-neutral-50 p-4">
        <p className="font-black">{stageCopy[stage].title}</p>
        <p className="mt-1 text-sm leading-5 text-neutral-500">{stageCopy[stage].description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
          <span className={`rounded-full px-3 py-1.5 ${localPhoto ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-500"}`}>
            Foto local: {localPhoto ? "lista" : "pendiente"}
          </span>
          <span className={`rounded-full px-3 py-1.5 ${clientPhoto ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-500"}`}>
            Foto cliente: {clientPhoto ? "lista" : "pendiente"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DeliveryFoodApp() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cartCount, setCartCount] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stage, setStage] = useState("browsing");
  const [localPhoto, setLocalPhoto] = useState(null);
  const [clientPhoto, setClientPhoto] = useState(null);
  const [showOrderPanel, setShowOrderPanel] = useState(false);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const matchesCategory = category === "Todos" || category === "Promos" || restaurant.category === category;
      const matchesQuery =
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const startBurgerOrder = (item) => {
    setSelectedRestaurant(restaurants[0]);
    setSelectedItem(item);
    setCartCount(1);
    setStage("created");
    setLocalPhoto(null);
    setClientPhoto(null);
    setShowOrderPanel(true);
  };

  const callCourier = () => {
    if (!selectedItem) return;
    setStage("courierCalled");
  };

  const handleLocalPhoto = (url) => {
    setLocalPhoto(url);
    setStage("localPhotoDone");
  };

  const beginDelivery = () => {
    if (!localPhoto) return;
    setStage("onTheWay");
  };

  const finishDelivery = () => {
    if (!localPhoto) return;
    setStage("clientPhotoRequired");
  };

  const handleClientPhoto = (url) => {
    setClientPhoto(url);
    setStage("completed");
  };

  const resetDemo = () => {
    setCartCount(0);
    setSelectedItem(null);
    setSelectedRestaurant(null);
    setStage("browsing");
    setLocalPhoto(null);
    setClientPhoto(null);
    setShowOrderPanel(false);
  };

  const subtotal = selectedItem ? selectedItem.price : 0;
  const deliveryFee = selectedItem ? 990 : 0;
  const serviceFee = selectedItem ? 490 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-sm">
              <Bike size={21} />
            </div>
            <div>
              <p className="text-xl font-black tracking-tight">FoodFlash</p>
              <p className="-mt-1 text-xs text-neutral-500">Prototipo trazable</p>
            </div>
          </div>

          <button className="hidden items-center gap-2 rounded-full bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-700 md:flex">
            <MapPin size={17} /> Santiago Centro
            <ChevronRight size={16} />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar restaurantes, platos o categorías"
              className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-100 pl-12 pr-4 text-sm outline-none transition focus:border-neutral-400 focus:bg-white"
            />
          </div>

          <button
            onClick={() => setShowOrderPanel(true)}
            className="relative flex h-12 items-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-bold text-white shadow-sm transition hover:scale-[1.02]"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Pedido</span>
            <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-neutral-950 shadow-md">
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[2rem] bg-neutral-950 text-white shadow-xl"
          >
            <div className="grid min-h-[350px] md:grid-cols-2">
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <div className="mb-5 w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                  Demo U: pedido con fotos obligatorias
                </div>
                <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                  Delivery con verificación visual del pedido.
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-white/70">
                  Simula una orden de hamburguesa donde el repartidor debe subir una foto al retirar en el local y otra al entregar al cliente.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setCategory("Hamburguesas");
                      setSelectedRestaurant(restaurants[0]);
                    }}
                    className="rounded-full bg-white px-6 py-3 text-sm font-black text-neutral-950 transition hover:scale-[1.03]"
                  >
                    Pedir hamburguesa
                  </button>
                  <button
                    onClick={() => setShowOrderPanel(true)}
                    className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                  >
                    Ver control del pedido
                  </button>
                </div>
              </div>
              <div className="relative min-h-[300px]">
                <img
                  src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop"
                  alt="Comida variada"
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-white/95 p-4 text-neutral-950 shadow-2xl backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-black">Sistema antifallas</p>
                      <p className="text-sm text-neutral-500">Evidencia del local + evidencia del cliente</p>
                    </div>
                    <div className="rounded-2xl bg-neutral-950 px-4 py-2 text-sm font-black text-white">Demo</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <OrderTracker stage={stage} localPhoto={localPhoto} clientPhoto={clientPhoto} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Panel del prototipo</h2>
              <button onClick={resetDemo} className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-black text-neutral-600 hover:bg-neutral-200">
                Reiniciar
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => startBurgerOrder(burgerMenu[2])}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.02]"
              >
                <Play size={17} /> Inicio de pedido
              </button>
              <button
                onClick={callCourier}
                disabled={!selectedItem || stage === "browsing"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 px-5 py-3 text-sm font-black text-neutral-800 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:text-neutral-400"
              >
                <Phone size={17} /> Llamar repartidor
              </button>
              <button
                onClick={beginDelivery}
                disabled={!localPhoto}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 px-5 py-3 text-sm font-black text-neutral-800 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:text-neutral-400"
              >
                <Bike size={17} /> Iniciar viaje
              </button>
              <button
                onClick={finishDelivery}
                disabled={!localPhoto || stage === "completed" || stage === "browsing"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
              >
                <Flag size={17} /> Término de pedido
              </button>
            </div>

            <div className="mt-5 rounded-3xl bg-neutral-50 p-4">
              <p className="font-black">Cómo presentarlo</p>
              <p className="mt-1 text-sm leading-5 text-neutral-500">
                Usa “Inicio de pedido”, luego “Llamar repartidor”. Ahí aparece la obligación de subir foto del local. Después usa “Iniciar viaje” y “Término de pedido” para pedir la foto final del cliente.
              </p>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Menú de Burger Barrio</h2>
                <p className="text-sm text-neutral-500">Selecciona una hamburguesa para crear un pedido falso.</p>
              </div>
              <span className="hidden rounded-full bg-neutral-100 px-4 py-2 text-sm font-black text-neutral-600 sm:block">Demo clickeable</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {burgerMenu.map((item) => (
                <motion.article
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className={`overflow-hidden rounded-[1.5rem] border bg-white shadow-sm transition ${selectedItem?.id === item.id ? "border-neutral-950 ring-2 ring-neutral-950" : "border-neutral-200"}`}
                >
                  <img src={item.image} alt={item.title} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-black">{item.title}</h3>
                    <p className="mt-1 min-h-[42px] text-sm leading-5 text-neutral-500">{item.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-lg font-black">{formatPrice(item.price)}</p>
                      <button
                        onClick={() => startBurgerOrder(item)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white transition hover:scale-110"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        </section>

        <section className="mt-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition ${
                  category === item ? "bg-neutral-950 text-white shadow-md" : "bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {item}
              </button>
            ))}
            <button className="flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-neutral-700 hover:bg-neutral-100">
              <SlidersHorizontal size={17} /> Filtros
            </button>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Restaurantes cerca de ti</h2>
              <p className="text-sm text-neutral-500">Opciones recomendadas según tu ubicación.</p>
            </div>
            <p className="hidden text-sm font-semibold text-neutral-500 sm:block">{filteredRestaurants.length} resultados</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRestaurants.map((restaurant, index) => (
              <motion.article
                key={restaurant.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group overflow-hidden rounded-[1.7rem] border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-110">
                    <Heart size={18} />
                  </button>
                  <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-black shadow-md">
                    {restaurant.promo}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">{restaurant.name}</h3>
                      <p className="text-sm text-neutral-500">{restaurant.category} · {restaurant.tags.join(" · ")}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-sm font-black">
                      <Star size={14} className="fill-current" /> {restaurant.rating}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm font-semibold text-neutral-600">
                    <span className="flex items-center gap-1.5"><Clock size={16} /> {restaurant.time}</span>
                    <span className="flex items-center gap-1.5"><Bike size={16} /> {restaurant.fee}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (restaurant.category === "Hamburguesas") {
                        setSelectedRestaurant(restaurant);
                        window.scrollTo({ top: 520, behavior: "smooth" });
                      }
                    }}
                    className="mt-5 w-full rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:scale-[1.02]"
                  >
                    {restaurant.category === "Hamburguesas" ? "Ver menú" : "Ver menú demo"}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {showOrderPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-950/40 p-4 backdrop-blur-sm"
            onClick={() => setShowOrderPanel(false)}
          >
            <motion.aside
              initial={{ x: 520 }}
              animate={{ x: 0 }}
              exit={{ x: 520 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              onClick={(event) => event.stopPropagation()}
              className="ml-auto flex h-full w-full max-w-xl flex-col overflow-hidden rounded-[2rem] bg-neutral-50 shadow-2xl"
            >
              <div className="border-b border-neutral-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-neutral-500">Pedido falso #{selectedItem ? "FF-2048" : "—"}</p>
                    <h2 className="text-2xl font-black">Seguimiento del pedido</h2>
                  </div>
                  <button onClick={() => setShowOrderPanel(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200">
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {selectedItem ? (
                  <>
                    <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-4">
                      <div className="flex gap-4">
                        <img src={selectedItem.image} alt={selectedItem.title} className="h-24 w-24 rounded-2xl object-cover" />
                        <div className="flex-1">
                          <p className="font-black">{selectedItem.title}</p>
                          <p className="text-sm text-neutral-500">{selectedRestaurant?.name || "Burger Barrio"}</p>
                          <p className="mt-2 text-sm font-bold text-neutral-700">Cliente: Martín Pérez · Depto 405</p>
                          <p className="mt-1 text-sm text-neutral-500">Incluye: hamburguesa, papas, bebida y servilletas.</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <ReceiptText size={19} />
                        <p className="font-black">Resumen de pago</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Producto</span><strong>{formatPrice(subtotal)}</strong></div>
                        <div className="flex justify-between"><span>Envío</span><strong>{formatPrice(deliveryFee)}</strong></div>
                        <div className="flex justify-between"><span>Servicio</span><strong>{formatPrice(serviceFee)}</strong></div>
                        <div className="border-t border-neutral-200 pt-2 flex justify-between text-base"><span className="font-black">Total</span><strong>{formatPrice(total)}</strong></div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-4">
                      <p className="font-black">Estado actual</p>
                      <p className="mt-1 text-sm leading-5 text-neutral-500">{stageCopy[stage].description}</p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <button
                          onClick={callCourier}
                          disabled={stage === "browsing" || stage === "completed"}
                          className="rounded-full bg-neutral-950 px-4 py-3 text-sm font-black text-white disabled:bg-neutral-200 disabled:text-neutral-400"
                        >
                          Llamar repartidor
                        </button>
                        <button
                          onClick={finishDelivery}
                          disabled={!localPhoto || stage === "completed"}
                          className="rounded-full bg-neutral-100 px-4 py-3 text-sm font-black text-neutral-800 disabled:text-neutral-400"
                        >
                          Término de pedido
                        </button>
                      </div>
                    </div>

                    <PhotoUploader
                      title="Foto obligatoria en el local"
                      description="Antes de entregar el pedido al repartidor, se sube una foto para comprobar que el local incluyó todo: bolsa, bebida, papas y hamburguesa."
                      icon={Camera}
                      photo={localPhoto}
                      disabled={stage !== "courierCalled" && stage !== "localPhotoDone"}
                      onUpload={handleLocalPhoto}
                    />

                    <PhotoUploader
                      title="Foto obligatoria al cliente"
                      description="Al llegar al destino, se sube una foto final para confirmar que el pedido fue entregado al cliente correcto."
                      icon={Home}
                      photo={clientPhoto}
                      disabled={stage !== "clientPhotoRequired" && stage !== "completed"}
                      onUpload={handleClientPhoto}
                    />

                    <div className="rounded-[1.5rem] bg-neutral-950 p-4 text-white">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={20} />
                        <p className="font-black">Resultado del sistema</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/70">
                        Si hay reclamo, la plataforma puede revisar dónde ocurrió el problema: preparación del local, traslado del repartidor o recepción del cliente.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center rounded-[2rem] border border-dashed border-neutral-300 bg-white p-10 text-center">
                    <ShoppingBag size={42} className="text-neutral-300" />
                    <p className="mt-4 text-xl font-black">Aún no hay pedido</p>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">Crea un pedido desde el menú de hamburguesas o usa el botón “Inicio de pedido”.</p>
                    <button onClick={() => startBurgerOrder(burgerMenu[2])} className="mt-5 rounded-full bg-neutral-950 px-5 py-3 text-sm font-black text-white">
                      Crear pedido demo
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
