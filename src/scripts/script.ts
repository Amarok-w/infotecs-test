import data from "./data";
// Импорт данных

interface Name {
  firstName: string;
  lastName: string;
}

interface Entry {
  id: string;
  name: Name;
  phone: string;
  about: string;
  eyeColor: string;
}

// Тело таблицы
const tbody = document.querySelector(".tbody");
// Блок переключения страниц
const pagesMenu = document.querySelector(".pages-menu");
// Указатель страницы
const pageCounter = document.querySelector(".pages-menu__counter");
// Шапка таблицы
const head = document.querySelector(".head");
// Кнопка отмены сортировки
const cancelSortButton = document.querySelector(".top-part__button");
// Форма редактирования данных
const form = document.querySelector(".form");
// Кнопка сохранения
const saveButton = document.querySelector(".form__button");

// Инпуты
const lastNameInput = document.querySelector(
  "#last-name-input"
) as HTMLInputElement;
const firstNameInput = document.querySelector(
  "#first-name-input"
) as HTMLInputElement;
const descriptionInput = document.querySelector(
  "#description-input"
) as HTMLInputElement;
const eyeColorInput = document.querySelector(
  "#eye-color-input"
) as HTMLInputElement;

// ID редактируемой записи
let selectedEntryId: string;

// Текущая страница
let currentPage: number = 1;
// Количество страниц
let pageAmount: number = Math.ceil(data.length / 10);

// Отсортирована ли таблица
let isSorted: boolean = false;
let lastNameSortType: string = "desc";
let firstNameSortType: string = "desc";
let descriptionSortType: string = "desc";
let eyeColorSortType: string = "desc";

// Отсортированный массив данных
let sortedData: Entry[] = [];

// Создание строки
function addRow(
  id: string,
  lastName: string,
  firstName: string,
  description: string,
  eyeColor: string
) {
  const row = document.createElement("tr");
  row.className = "row";
  row.setAttribute("data-id", id);

  row.innerHTML = `
  <td class="el">${lastName}</td>
  <td class="el">${firstName}</td>
  <td class="el">
    <p class="el_description">${description}</p>
  </td>
  <td class="el el_eye-color" style="color: ${eyeColor}" bgcolor="${eyeColor}">${eyeColor}</td>
  `;

  tbody?.append(row);
}

// Обновление таблицы
function refreshTable() {
  // Обновление счётчика
  if (pageCounter != null) {
    pageCounter.innerHTML = currentPage.toString();
  }
  // Обнуление содержимого таблицы
  if (tbody != null) {
    tbody.innerHTML = "";
  }

  if (isSorted) {
    // Сортировка
    let currentEntries = sortedData.slice(
      (currentPage - 1) * 10,
      10 * currentPage
    );
    for (const item of currentEntries) {
      addRow(
        item.id,
        item.name.lastName,
        item.name.firstName,
        item.about,
        item.eyeColor
      );
    }
  } else if (isSorted == false) {
    // Переход по странице
    let currentEntries = data.slice((currentPage - 1) * 10, 10 * currentPage);
    for (const item of currentEntries) {
      addRow(
        item.id,
        item.name.lastName,
        item.name.firstName,
        item.about,
        item.eyeColor
      );
    }
  }
}

// Кнопки перехода по страницам
pagesMenu?.addEventListener("click", (e) => {
  const clickedElement = e.target as HTMLElement;
  if (clickedElement.classList.contains("pages-menu__left-arrow")) {
    if (tbody != null) {
      if (currentPage != 1) {
        currentPage -= 1;
        refreshTable();
      }
    }
  } else if (clickedElement.classList.contains("pages-menu__right-arrow")) {
    if (currentPage < pageAmount) {
      currentPage += 1;
      refreshTable();
    }
  }
});

// Сортировка
head?.addEventListener("click", (e) => {
  const clickedElement = e.target as HTMLElement;

  switch (clickedElement.dataset.columnName) {
    case "lastName":
      if (lastNameSortType == "desc") {
        sortedData = [...data].sort((rowX: Entry, rowY: Entry) => {
          return rowX.name.lastName > rowY.name.lastName ? 1 : -1;
        });

        lastNameSortType = "asc";
      } else {
        sortedData = [...data].sort((rowX: Entry, rowY: Entry) => {
          return rowX.name.lastName > rowY.name.lastName ? -1 : 1;
        });

        lastNameSortType = "desc";
      }

      isSorted = true;
      refreshTable();
      break;
    case "firstName":
      if (firstNameSortType == "desc") {
        sortedData = [...data].sort((rowX: Entry, rowY: Entry) => {
          return rowX.name.firstName > rowY.name.firstName ? 1 : -1;
        });

        firstNameSortType = "asc";
      } else {
        sortedData = [...data].sort((rowX: Entry, rowY: Entry) => {
          return rowX.name.firstName > rowY.name.firstName ? -1 : 1;
        });

        firstNameSortType = "desc";
      }

      isSorted = true;
      refreshTable();
      break;
    case "description":
      if (descriptionSortType == "desc") {
        sortedData = [...data].sort((rowX: Entry, rowY: Entry) => {
          return rowX.about > rowY.about ? 1 : -1;
        });

        descriptionSortType = "asc";
      } else {
        sortedData = [...data].sort((rowX: Entry, rowY: Entry) => {
          return rowX.about > rowY.about ? -1 : 1;
        });

        descriptionSortType = "desc";
      }

      isSorted = true;
      refreshTable();
      break;
    case "eyeColor":
      if (eyeColorSortType == "desc") {
        sortedData = [...data].sort((rowX: Entry, rowY: Entry) => {
          return rowX.eyeColor > rowY.eyeColor ? 1 : -1;
        });
        eyeColorSortType = "asc";
      } else {
        sortedData = [...data].sort((rowX: Entry, rowY: Entry) => {
          return rowX.eyeColor > rowY.eyeColor ? -1 : 1;
        });
        eyeColorSortType = "desc";
      }

      isSorted = true;
      refreshTable();
      break;
  }
});

// Отмена сортировки
cancelSortButton?.addEventListener("click", () => {
  isSorted = false;
  refreshTable();
});


// Обработка клика на строку таблицы
tbody?.addEventListener("click", (e) => {
  const clickedElement = e.target as HTMLElement;
  const clickedRow = clickedElement.closest(".row") as HTMLElement;

  if (clickedRow != null) {
    const selectedEntry = data.find((item) => item.id == clickedRow.dataset.id);

    if (selectedEntry != null) {
      selectedEntryId = selectedEntry?.id;

      lastNameInput.value = selectedEntry.name.lastName;
      firstNameInput.value = selectedEntry.name.firstName;
      descriptionInput.value = selectedEntry.about;
      eyeColorInput.value = selectedEntry.eyeColor;
    }

    form?.classList.remove("form_hide");
  }
});

// Обработка клика кнопки сохранить
saveButton?.addEventListener("click", () => {
  const selectedEntry = data.find((item) => item.id == selectedEntryId);
  if (selectedEntry != null) {
    selectedEntry.name.lastName = lastNameInput.value;
    selectedEntry.name.firstName = firstNameInput.value;
    selectedEntry.about = descriptionInput.value;
    selectedEntry.eyeColor = eyeColorInput.value;

    refreshTable();
    form?.classList.add("form_hide");
  }
});

// Заполнение таблицы
refreshTable();