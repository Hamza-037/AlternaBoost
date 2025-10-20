/**
 * Système de gestion d'erreurs centralisé
 * Fournit des classes d'erreur typées et des handlers
 */

/**
 * Types d'erreurs de l'application
 */
export enum ErrorType {
  VALIDATION = "VALIDATION_ERROR",
  API = "API_ERROR",
  OPENAI = "OPENAI_ERROR",
  AUTH = "AUTH_ERROR",
  RATE_LIMIT = "RATE_LIMIT_ERROR",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL = "INTERNAL_ERROR",
  NETWORK = "NETWORK_ERROR",
}

/**
 * Classe de base pour les erreurs de l'application
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    statusCode = 500,
    isOperational = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erreur de validation des données
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.VALIDATION, 400, true, context);
  }
}

/**
 * Erreur d'API OpenAI
 */
export class OpenAIError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.OPENAI, 500, true, context);
  }
}

/**
 * Erreur d'authentification
 */
export class AuthError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.AUTH, 401, true, context);
  }
}

/**
 * Erreur de rate limiting
 */
export class RateLimitError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.RATE_LIMIT, 429, true, context);
  }
}

/**
 * Erreur ressource non trouvée
 */
export class NotFoundError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.NOT_FOUND, 404, true, context);
  }
}

/**
 * Interface pour la réponse d'erreur
 */
interface ErrorResponse {
  error: string;
  message: string;
  type: ErrorType;
  statusCode: number;
  context?: Record<string, unknown>;
  stack?: string;
}

/**
 * Logger d'erreurs (à remplacer par Sentry en production)
 */
export const logger = {
  error: (message: string, error: unknown, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "production") {
      // TODO: Intégrer Sentry ici
      console.error("[ERROR]", message, {
        error: error instanceof Error ? error.message : String(error),
        context,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error("[ERROR]", message, error, context);
    }
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn("[WARN]", message, context);
  },

  info: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[INFO]", message, context);
    }
  },
};

/**
 * Convertit une erreur en réponse JSON formatée
 */
export function formatErrorResponse(error: unknown): ErrorResponse {
  // Si c'est une AppError personnalisée
  if (error instanceof AppError) {
    return {
      error: error.name,
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
      context: error.context,
      ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
    };
  }

  // Si c'est une erreur Zod de validation
  if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
    const zodError = error as { issues?: Array<{ path: string[]; message: string }> };
    return {
      error: "ValidationError",
      message: "Les données fournies sont invalides",
      type: ErrorType.VALIDATION,
      statusCode: 400,
      context: {
        validationErrors: zodError.issues?.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    };
  }

  // Si c'est une erreur OpenAI
  if (error && typeof error === "object" && "status" in error) {
    const openaiError = error as { status?: number; message?: string };
    if (openaiError.status === 429) {
      return {
        error: "OpenAI Rate Limit",
        message: "Trop de requêtes vers OpenAI. Veuillez réessayer dans quelques instants.",
        type: ErrorType.RATE_LIMIT,
        statusCode: 429,
      };
    }
    if (openaiError.status === 401) {
      return {
        error: "OpenAI Authentication",
        message: "Erreur d'authentification avec OpenAI. Vérifiez votre clé API.",
        type: ErrorType.AUTH,
        statusCode: 500,
      };
    }
  }

  // Erreur générique
  const genericError = error instanceof Error ? error : new Error(String(error));
  return {
    error: "InternalError",
    message:
      process.env.NODE_ENV === "production"
        ? "Une erreur interne s'est produite. Veuillez réessayer."
        : genericError.message,
    type: ErrorType.INTERNAL,
    statusCode: 500,
    ...(process.env.NODE_ENV !== "production" && { stack: genericError.stack }),
  };
}

/**
 * Handler d'erreur pour les routes API Next.js
 */
export function handleApiError(error: unknown): Response {
  const errorResponse = formatErrorResponse(error);

  // Logger l'erreur
  logger.error("API Error", error, errorResponse.context);

  // Retourner la réponse
  return new Response(JSON.stringify(errorResponse), {
    status: errorResponse.statusCode,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Wrapper pour les routes API avec gestion d'erreur automatique
 */
export function withErrorHandling<T>(
  handler: (request: Request) => Promise<Response>
): (request: T) => Promise<Response> {
  return async (request: T) => {
    try {
      return await handler(request as unknown as Request);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Utilitaires pour vérifier les erreurs côté client
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isOpenAIError(error: unknown): error is OpenAIError {
  return error instanceof OpenAIError;
}

export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

/**
 * Messages d'erreur en français pour les utilisateurs
 */
export const ErrorMessages = {
  VALIDATION: {
    MISSING_FIELD: "Tous les champs obligatoires doivent être remplis",
    INVALID_EMAIL: "L'adresse email n'est pas valide",
    INVALID_PHONE: "Le numéro de téléphone n'est pas valide",
    TOO_SHORT: (field: string, min: number) => 
      `Le champ ${field} doit contenir au moins ${min} caractères`,
    TOO_LONG: (field: string, max: number) => 
      `Le champ ${field} ne peut pas dépasser ${max} caractères`,
  },
  OPENAI: {
    API_KEY_MISSING: "La clé API OpenAI n'est pas configurée",
    API_ERROR: "Erreur lors de la communication avec le service d'IA",
    RATE_LIMIT: "Trop de requêtes. Veuillez patienter quelques instants",
    TIMEOUT: "Le service d'IA met trop de temps à répondre. Réessayez",
  },
  RATE_LIMIT: {
    TOO_MANY_REQUESTS: "Vous avez effectué trop de requêtes. Veuillez patienter",
  },
  GENERAL: {
    INTERNAL_ERROR: "Une erreur interne s'est produite",
    NETWORK_ERROR: "Erreur de connexion. Vérifiez votre connexion internet",
    NOT_FOUND: "La ressource demandée n'a pas été trouvée",
  },
};
