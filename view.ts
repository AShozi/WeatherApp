// // render.ts
// function renderData(data: any) {
//   const container = document.getElementById("data-container");
//   if (!container) return;

//   container.innerHTML = "";

//   data.forEach((item: any) => {
//     const itemElement = document.createElement("div");
//     itemElement.className = "bg-white p-4 rounded shadow";

//     itemElement.innerHTML = `
//         <h2 class="text-xl font-semibold mb-2">${item.name}</h2>
//         <p class="text-gray-700">${item.description}</p>
//       `;

//     container.appendChild(itemElement);
//   });
// }

// export { renderData };
