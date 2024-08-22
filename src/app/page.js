import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.description}>
        <p>File System managment</p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/ucompensar-logo.png"
              alt="Ucompensar Logo"
              className={styles.UcompensarLogo}
              width={120}
              height={36}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.section}>
        <h1>Proyecto: Sistema de Gestión de Archivos Jerárquico</h1>
        <h3>Descripción del Proyecto:</h3>
        <p>
          Desarrollar un sistema de gestión de archivos que simule una estructura
          de directorios y archivos utilizando árboles binarios. Este sistema
          permitirá a los usuarios crear, eliminar y navegar a través de
          directorios y archivos, y al mismo tiempo, ofrecerá funcionalidades
          avanzadas como el cálculo de la altura del árbol de directorios, el
          conteo de archivos y directorios, la evaluación del peso de un
          directorio, y la comparación de dos estructuras de directorios para
          verificar si son similares.
        </p>

        <h2>Requerimientos Específicos:</h2>

        <h3>1. Función para devolver la altura de un árbol:</h3>
        <ul>
          <li>
            <p>
              Implementa una función que calcule la altura de la estructura de
              directorios (es decir, la profundidad máxima desde la raíz hasta
              cualquier hoja).
            </p>
          </li>
          <li>
            <p>
              Esta función será útil para determinar la profundidad del sistema
              de directorios.
            </p>
          </li>
        </ul>
        <h3>2. Algoritmo para calcular el número de nodos:</h3>
        <ul>
          <li>
            <p>
              Crea una función que recorra el árbol de directorios y archivos, y
              devuelva el número total de nodos (donde un nodo puede representar
              un directorio o un archivo).
            </p>
          </li>
          <li>
            <p>
              Si el árbol está vacío, debería devolver 0. Si tiene nodos, cuenta
              todos los archivos y directorios.
            </p>
          </li>
        </ul>
        <h3>3. Algoritmo para devolver el peso de un árbol:</h3>
        <ul>
          <li>
            <p>
              Implementa una función que calcule el "peso" de un directorio,
              definido como la suma de los tamaños de todos los archivos
              contenidos en ese directorio y sus subdirectorios.
            </p>
          </li>
          <li>
            <p>
              Esta función será útil para determinar la profundidad del sistema
              de directorios.
            </p>
          </li>
        </ul>
        <h3>4. Función para comprobar si dos árboles son similares:</h3>
        <ul>
          <li>
            <p>
              Diseña una función que compare dos estructuras de directorios y
              determine si son similares, es decir, si ambos tienen la misma
              estructura (aunque los nombres de los archivos y directorios
              puedan diferir).
            </p>
          </li>
          <li>
            <p>
              Dos árboles son similares si ambos son nulos, o si tienen una
              estructura idéntica, con subárboles derechos e izquierdos
              similares.
            </p>
          </li>
        </ul>
      </div>
    </main>
  );
}
