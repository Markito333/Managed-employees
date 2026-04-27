export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'on_leave';
  avatar?: string;
  startDate: string;
}

export const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'María González',
    position: 'Gerente de Recursos Humanos',
    department: 'Recursos Humanos',
    email: 'maria.gonzalez@empresa.com',
    phone: '+52 555 123 4567',
    status: 'active',
    startDate: '2020-03-15',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    position: 'Desarrollador Full Stack',
    department: 'Tecnología',
    email: 'carlos.rodriguez@empresa.com',
    phone: '+52 555 234 5678',
    status: 'active',
    startDate: '2021-06-01',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    position: 'Diseñadora UX/UI',
    department: 'Diseño',
    email: 'ana.martinez@empresa.com',
    phone: '+52 555 345 6789',
    status: 'active',
    startDate: '2022-01-10',
  },
  {
    id: '4',
    name: 'Luis Hernández',
    position: 'Contador',
    department: 'Finanzas',
    email: 'luis.hernandez@empresa.com',
    phone: '+52 555 456 7890',
    status: 'on_leave',
    startDate: '2019-08-20',
  },
  {
    id: '5',
    name: 'Sofia López',
    position: 'Marketing Digital',
    department: 'Marketing',
    email: 'sofia.lopez@empresa.com',
    phone: '+52 555 567 8901',
    status: 'active',
    startDate: '2023-02-28',
  },
  {
    id: '6',
    name: 'Miguel Torres',
    position: 'Soporte Técnico',
    department: 'Tecnología',
    email: 'miguel.torres@empresa.com',
    phone: '+52 555 678 9012',
    status: 'inactive',
    startDate: '2021-09-15',
  },
  {
    id: '7',
    name: 'Laura Fernández',
    position: 'Abogada Corporativa',
    department: 'Legal',
    email: 'laura.fernandez@empresa.com',
    phone: '+52 555 789 0123',
    status: 'active',
    startDate: '2020-11-01',
  },
  {
    id: '8',
    name: 'Roberto Sánchez',
    position: 'Gerente de Ventas',
    department: 'Ventas',
    email: 'roberto.sanchez@empresa.com',
    phone: '+52 555 890 1234',
    status: 'active',
    startDate: '2018-05-10',
  },
];