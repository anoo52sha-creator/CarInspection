
// export default function WhatsAppButton() {
//   const phoneNumber = "971501234567";

//   return (
//     <a
//       href={`https://wa.me/${phoneNumber}`}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="fixed bottom-6 right-6 z-50 w-16 h-16
//                  hover:scale-110 transition"
//     >
//       <img
//         src="/whatsapp.png"
//         alt="WhatsApp"
//         className="w-full h-full drop-shadow-[0_0_25px_rgba(37,211,102,0.7)]"
//       />
//     </a>
//   );
// }
export default function WhatsAppWidget() {
  const phoneNumber = "971501234567"; // UAE number without +
  const message = "Hi, I want to know more about your mobile car service.";

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <>
      {/* LEFT: WhatsApp Icon */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 
                   w-16 h-16 rounded-full 
                   bg-[#25D366]
                   flex items-center justify-center
                   shadow-[0_0_30px_rgba(37,211,102,0.6)]
                   hover:scale-110 transition"
      >
        {/* <img
          src="/whatsapp.png"
          alt="WhatsApp"
          className="w-8 h-8"
        /> */}
        <img
        src="/whatsapp.png"
        alt="WhatsApp"
        className="w-full h-full drop-shadow-[0_0_25px_rgba(37,211,102,0.7)]"
      />
      </a>

      

      {/* 💬 RIGHT: CHAT BOX
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50
                   bg-white text-black
                   rounded-2xl px-6 py-4
                   w-[260px]
                   shadow-xl hover:shadow-2xl
                   transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366]
                          flex items-center justify-center">
            <img src="/chat.png" className="w-5 h-5" />
          </div>

          <div>
            <p className="font-semibold text-base">Chat with us</p>
            <p className="text-sm text-gray-500">
              We reply instantly 👋
            </p>
          </div>
        </div>
      </a> */}
    </>
  );
}
