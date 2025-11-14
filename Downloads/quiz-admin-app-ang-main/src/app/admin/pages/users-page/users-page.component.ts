// users-page.component.ts
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../../services/users.service';
import { User } from '../../../interfaces/users.interface';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;
  isLoading = true;
  error: string | null = null;
  isDetailsVisible = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = [...users];
        this.isLoading = false;
        localStorage.setItem('userCount', users.length.toString());
        console.log('Combined users loaded:', this.users);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = 'Failed to load users: ' + (error.message || JSON.stringify(error));
        this.isLoading = false;
        console.error('Error loading combined users:', error);
        this.cdr.markForCheck();
      },
    });
  }

  viewUser(id: string): void {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.selectedUser = user;
        console.log('User details:', user);
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = 'Failed to load user details';
        console.error('Error loading user:', error);
        this.cdr.markForCheck();
      },
    });
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user.id !== id);
          this.selectedUser = null;
          console.log(`User with ID ${id} deleted`);
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.error = 'Failed to delete user';
          console.error('Error deleting user:', error);
          this.cdr.markForCheck();
        },
      });
    }
  }

  closeUserDetails(): void {
    this.selectedUser = null;
    this.cdr.markForCheck();
  }

  toggleDetailsUser(id: string): void {
    if (this.selectedUser?.id === id) {
      // Если уже открыт — закрываем
      this.selectedUser = null;
      this.isDetailsVisible = false;
    } else {
      // Закрываем предыдущие, если были
      this.selectedUser = null;
      this.isDetailsVisible = false;
  
      // Пытаемся взять из кэша (если results уже загружены)
      const cachedUser = this.users.find(u => u.id === id);
      if (cachedUser?.results && cachedUser.results.length > 0) {
        this.selectedUser = cachedUser;
        this.isDetailsVisible = true;
        this.cdr.markForCheck();
      } else {
        // Если нет полных данных — загружаем с сервера
        this.isLoading = true;
        this.cdr.markForCheck();
  
        this.userService.getUserById(id).subscribe({
          next: (fullUser) => {
            this.selectedUser = fullUser;
            // Опционально: обновляем кэш
            const index = this.users.findIndex(u => u.id === id);
            if (index !== -1) {
              this.users[index] = { ...this.users[index], ...fullUser };
            }
            this.isDetailsVisible = true;
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            this.error = 'Не удалось загрузить детали пользователя';
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
      }
    }
  }
}